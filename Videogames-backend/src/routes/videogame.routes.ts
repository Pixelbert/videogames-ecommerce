import { Router } from 'express';
import { getVideogames } from '../controllers/videogame.controller';

const router = Router();

// Cuando alguien entre a la ruta principal ('/'), ejecutará getVideogames
router.get('/', getVideogames);

export default router;