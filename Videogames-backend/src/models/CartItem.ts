import { Model } from 'objection';

export class CartItem extends Model {
    user_id!: number;
    videogame_id!: number;
    cantidad!: number;

    static get tableName() {
        return 'cart_items';
    }

    // El carrito usa dos llaves primarias, se lo especificamos a Objection
    static get idColumn() {
        return ['user_id', 'videogame_id'];
    }
}