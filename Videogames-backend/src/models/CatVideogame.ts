import { Model } from 'objection';

export class CatVideogame extends Model {
    id!: number;
    titulo!: string;
    descripcion!: string;
    precio!: number;
    stock!: number;
    consola!: string;
    imagen_url!: string;

    static get tableName() {
        return 'videogames';
    }
}