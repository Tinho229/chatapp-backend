import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/database/db";
import jwt from "jsonwebtoken";

const randomImages = [
    'https://images.unsplash.com/photo-1741034495199-cf7fbb5c49b6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    'https://images.unsplash.com/photo-1740252117044-2af197eea287?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    'https://plus.unsplash.com/premium_photo-1776944945233-3f50a2cba564?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    'https://plus.unsplash.com/premium_photo-1776944945330-74899c4e37f5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
];

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "KpwFLooK0KCagRqklDtiomkzxzN2WcEyfBXKBo0a6U6";

export const register = async (req: Request, res: Response): Promise<any> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis (username, email, password)" });
    }

    try {
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const randomImage: string = randomImages[Math.floor(Math.random() * randomImages.length)];
        
        const result = await pool.query(
            `INSERT INTO users (username, email, password, profil_img)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email, profil_img`,
            [username, email, hashPassword, randomImage]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: '10h' }
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                ...user,
                token
            }
        });

    } catch (error: any) {
        console.error("Register error:", error);
        if (error.code === '23505') {
            return res.status(409).json({
                error: "Cet email ou nom d'utilisateur est déjà utilisé"
            });
        }
        return res.status(500).json({
            error: "Failed to register user"
        });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
        const result = await pool.query(query, [email]);
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credential' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '10h' });

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profil_img: user.profil_img,
                token
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: 'Failed to login user' });
    }
};
