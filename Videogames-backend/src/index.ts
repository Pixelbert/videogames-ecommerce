import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Model } from 'objection';
import db from './database'; 
import videogameRoutes from './routes/videogame.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes'; // <-- 1. IMPORTA AQUÍ

console.log("Iniciando el archivo index.ts...");

const app = express();
Model.knex(db);

app.use(cors()); 
app.use(express.json());

// 4. Registrar las Rutas
app.use('/api/videogames', videogameRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes); // <-- 2. ACTÍVALA AQUÍ

app.get('/', (req, res) => {
    res.send('¡Bienvenido al API del E-commerce de Videojuegos!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en http://localhost:${PORT}`);
});