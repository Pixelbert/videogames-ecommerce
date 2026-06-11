import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';


const router = Router();

// Cuando alguien envíe datos por POST a esta ruta, se registra
router.post('/register', register);
router.post('/login', login);

export default router;