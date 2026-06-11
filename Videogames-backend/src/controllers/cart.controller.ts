import { Request, Response } from 'express';
import { CartItem } from '../models/CartItem';
import { CatVideogame } from '../models/CatVideogame';

// Función 1: Agregar un juego al carrito
export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        // Recibimos qué usuario compra, qué juego quiere y cuántas copias
        const { user_id, videogame_id, cantidad } = req.body;

        // 1. Verificar si el videojuego realmente existe en la tienda
        const game = await CatVideogame.query().findById(videogame_id);
        if (!game) {
            res.status(404).json({ success: false, message: 'El videojuego no existe en el catálogo.' });
            return;
        }

        // 2. Revisar si el usuario ya había agregado este mismo juego al carrito antes
        const itemExistente = await CartItem.query().findOne({ user_id: user_id, videogame_id: videogame_id });

        if (itemExistente) {
            // Si ya lo tenía, solo le sumamos la nueva cantidad (Ej: tenía 1, agrega 1 más = 2)
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            await CartItem.query()
                .patch({ cantidad: nuevaCantidad })
                .where({ user_id: user_id, videogame_id: videogame_id });
        } else {
            // Si es un juego nuevo para su carrito, lo insertamos desde cero
            await CartItem.query().insert({
                user_id: user_id,
                videogame_id: videogame_id,
                cantidad: cantidad
            });
        }

        res.status(200).json({ success: true, message: 'Videojuego agregado al carrito con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al agregar al carrito.' });
    }
};

// Función 2: Ver el carrito de un usuario
export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Extraemos el user_id y le aseguramos a TypeScript que es un texto
        const userIdString = req.params.user_id as string;
        
        // 2. Ahora sí lo convertimos a número sin que marque error
        const userIdNumber = parseInt(userIdString);

        const miCarrito = await CartItem.query()
            .where({ user_id: userIdNumber })
            .join('videogames', 'cart_items.videogame_id', 'videogames.id')
            .select(
                'videogames.id as videogame_id', 
                'videogames.titulo', 
                'videogames.precio', 
                'cart_items.cantidad'
            );

        let total = 0;
        
        miCarrito.forEach((item: any) => {
            total += Number(item.precio) * item.cantidad;
        });

        res.status(200).json({ 
            success: true, 
            total_pagar: total,
            items: miCarrito 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener el carrito.' });
    }
};
// Función 3: Eliminar un juego del carrito
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        // Recibimos ambos IDs desde la URL
        const userIdNumber = parseInt(req.params.user_id as string);
        const videogameIdNumber = parseInt(req.params.videogame_id as string);

        // Le decimos a la base de datos que borre la fila que coincida con ese usuario y ese juego
        const borrados = await CartItem.query()
            .delete()
            .where({ user_id: userIdNumber, videogame_id: videogameIdNumber });

        if (borrados > 0) {
            res.status(200).json({ success: true, message: 'Videojuego eliminado del carrito.' });
        } else {
            res.status(404).json({ success: false, message: 'El videojuego no estaba en el carrito.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al eliminar el videojuego del carrito.' });
    }
};