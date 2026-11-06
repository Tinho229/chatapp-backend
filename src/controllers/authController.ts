import { Request, Response } from "express";
import bcrypt from "bcrypt" ;
import pool from "../config/database/db";
import jwt  from "jsonwebtoken";

const SALT_ROUNDS  = 10  ;
const JWT_SECRET  = process.env.JWT_SECRET || "KpwFLooK0KCagRqklDtiomkzxzN2WcEyfBXKBo0a6U6" ;

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email`,
            [username, email, hashPassword]
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

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Failed to register user"
        });
    }
};

export const login = async(req : Request , res : Response) : Promise<any> => {

    const {email , password} = req.body ;
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
        const result = await  pool.query(query , [email]);
        const user = result.rows[0];
        if(!user) return res.status(404).json({error : 'User not found'}) ;
        const isMatch = await bcrypt.compare(password , user.password) ;

        if(!isMatch) return res.status(400).json({error : 'Invalid credential'}) ;

        const token  = jwt.sign({id : user.id} , JWT_SECRET , {expiresIn : '10h'} ) ;

        

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                token
            }
        });

    } catch (error) {
        res.status(500).json({error : 'Failed to login user'}) ;
    }
    
    
    
    


};