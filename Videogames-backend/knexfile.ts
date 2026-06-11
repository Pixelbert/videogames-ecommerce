import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '12345678',
      database: process.env.DB_NAME || 'ecommerce_gamesdb',
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './db/seeds',
      extension: 'ts'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};

export default config;