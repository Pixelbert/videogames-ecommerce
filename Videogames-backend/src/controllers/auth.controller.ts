import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        // 1. Recibimos los datos que el usuario envía
        const { nombre, email, password } = req.body;

        // 2. Encriptamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Guardamos al usuario en la base de datos
        const newUser = await User.query().insert({
            nombre: nombre,
            email: email,
            password: hashedPassword,
            role: 'user'
        });

        // 4. Respondemos que todo salió bien (ocultando la contraseña)
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: { 
                id: newUser.id, 
                nombre: newUser.nombre, 
                email: newUser.email 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al registrar el usuario. Puede que el correo ya exista.' 
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Buscamos si el correo existe en la base de datos
        const user = await User.query().findOne({ email: email });
        if (!user) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
            return;
        }

        // 2. Comparamos la contraseña que escribió con la encriptada en la base de datos
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ success: false, message: 'Contraseña incorrecta.' });
            return;
        }

        // 3. Generamos el Token JWT (el gafete virtual)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'mi_clave_secreta_de_respaldo_123', // <-- EL CAMBIO ESTÁ AQUÍ
            { expiresIn: '2h' } 
        );

        res.status(200).json({ 
            success: true, 
            message: 'Login exitoso.',
            token: token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión.' });
    }
};