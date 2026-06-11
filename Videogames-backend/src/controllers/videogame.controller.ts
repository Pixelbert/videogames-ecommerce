import { Request, Response } from 'express';
import { CatVideogame } from '../models/CatVideogame';

export const getVideogames = async (req: Request, res: Response) => {
    try {
        // Le pedimos al modelo que nos traiga todos los juegos de la tabla
        const games = await CatVideogame.query();
        
        // Respondemos con los datos en formato JSON
        res.status(200).json({
            success: true,
            data: games
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el catálogo de videojuegos'
        });
    }
};