import knex from 'knex';
import knexConfig from '../knexfile';
import { Knex } from 'knex';

const environment = process.env.NODE_ENV || 'development';
const config: Knex.Config | undefined = knexConfig[environment];

if (!config) {
    throw new Error(`¡Error! La configuración de Knex para el entorno '${environment}' no fue encontrada.`);
}

export default knex(config);