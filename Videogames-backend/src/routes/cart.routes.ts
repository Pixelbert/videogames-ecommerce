import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Ruta para agregar al carrito (POST)
router.post('/add', verifyToken, addToCart);
router.get('/:user_id', verifyToken, getCart);
router.delete('/:user_id/:videogame_id', verifyToken, removeFromCart);

export default router;