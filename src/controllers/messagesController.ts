import { Request, Response } from "express";
import pool from "../config/database/db";

export const fetchAllMessagesByConversationId = async (req : Request , res : Response) => {
    const { conversationId } = req.params;

    try {
            const result = await pool.query( `
                SELECT m.id , m.content, m.sender_id , m.conversation_id , m.created_at 
                FROM messages m
                WHERE m.conversation_id =$1`,
                 [conversationId]) ;

            return res.json(result.rows)
    } catch (error) {
        res.status(500).json({error : 'Failed to fetch messages'}) ;
    }
}

export const saveMessge = async (conversationId : string , sendId : string , content : string) => {
    

    try {
            const result = await pool.query( `
                INSERT INTO messages (conversation_id , sender_id , content VALUES($1 , $2 , $3) RETURNING *`,
                 [conversationId , sendId , content ]) ;

            return result.rows[0] ;
    } catch (err) {
        console.error('Error saving message' , err)
        throw new Error('Failed to save message')
    } 
}