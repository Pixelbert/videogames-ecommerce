import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Eliminamos las tablas si ya existen (para evitar errores si corremos esto varias veces)
    await knex.schema.dropTableIfExists('cart_items');
    await knex.schema.dropTableIfExists('videogames');
    await knex.schema.dropTableIfExists('users');
   
    // 1. Crear Tabla de Usuarios
    await knex.schema
      .createTable('users', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.string('nombre', 100).notNullable();
        table.string('email', 100).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('role', 50).defaultTo('user');
      });
     
    // 2. Crear Tabla de Videojuegos (Nuestro catálogo)
    await knex.schema
      .createTable('videogames', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.string('titulo', 150).notNullable().unique();
        table.text('descripcion');
        table.decimal('precio', 10, 2).notNullable(); // Para manejar precios con decimales
        table.integer('stock').notNullable().defaultTo(0);
        table.string('consola', 100);
        table.string('imagen_url', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
     
    // 3. Crear Tabla del Carrito de Compras
    await knex.schema
      .createTable('cart_items', (table: Knex.TableBuilder) => {
        // Relacionamos esta tabla con el usuario y con el videojuego
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('videogame_id').unsigned().notNullable().references('id').inTable('videogames').onDelete('CASCADE');
        
        table.integer('cantidad').notNullable().defaultTo(1); 
        
        // Un usuario no debe tener dos filas distintas para el mismo juego, solo actualiza la "cantidad"
        table.primary(['user_id', 'videogame_id']);
      });
}

export async function down(knex: Knex): Promise<void> {
    // Si queremos revertir los cambios, borramos en orden inverso
    await knex.schema.dropTableIfExists('cart_items');
    await knex.schema.dropTableIfExists('videogames');
    await knex.schema.dropTableIfExists('users');
}