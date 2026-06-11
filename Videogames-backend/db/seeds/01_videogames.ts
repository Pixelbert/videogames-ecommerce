import { Knex } from 'knex';

const videogamesData = [
    {
        titulo: 'The Legend of Zelda: Tears of the Kingdom',
        descripcion: 'Una aventura épica a través de la tierra y los cielos de Hyrule.',
        precio: 1399.00,
        stock: 50,
        consola: 'Nintendo Switch',
        imagen_url: 'zelda_totk.png'
    },
    {
        titulo: 'God of War Ragnarök',
        descripcion: 'Kratos y Atreus deben viajar a cada uno de los Nueve Reinos en busca de respuestas.',
        precio: 1250.50,
        stock: 30,
        consola: 'PlayStation 5',
        imagen_url: 'gow_ragnarok.png'
    },
    {
        titulo: 'Halo Infinite',
        descripcion: 'La legendaria serie Halo regresa con la campaña más amplia hasta la fecha.',
        precio: 999.00,
        stock: 100,
        consola: 'Xbox Series X',
        imagen_url: 'halo_infinite.png'
    },
    {
        titulo: 'Elden Ring',
        descripcion: 'El nuevo juego de rol y acción de fantasía de FromSoftware.',
        precio: 1199.99,
        stock: 15,
        consola: 'PC',
        imagen_url: 'elden_ring.png'
    }
];

export async function seed(knex: Knex): Promise<void> {
    const TABLE_NAME = 'videogames';
    
    // 1. Borramos cualquier dato anterior para evitar duplicados
    await knex(TABLE_NAME).del();
    
    // 2. Insertamos el catálogo nuevo
    await knex(TABLE_NAME).insert(videogamesData);
    
    console.log(`¡Éxito! ${videogamesData.length} videojuegos insertados en tu tienda.`);
}