import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Le decimos a TypeScript que nuestra petición (Request) ahora podrá llevar datos del usuario
export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // 1. Buscamos si el usuario trae su "gafete" (token) en los encabezados
    const authHeader = req.headers['authorization'];
    
    // Normalmente el formato es "Bearer eyJhbG...", así que lo partimos para agarrar solo el código
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        res.status(401).json({ success: false, message: 'Acceso denegado. Se requiere un token.' });
        return;
    }

    try {
        // 2. Verificamos que el token sea auténtico y no esté vencido
        const secret = process.env.JWT_SECRET || 'mi_clave_secreta_de_respaldo_123';
        const decoded = jwt.verify(token, secret);
        
        // 3. Si todo está bien, lo dejamos pasar a la ruta que quería ir
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: 'Token inválido o expirado.' });
    }
};