import { Request, Response } from "express";
import pool from "../config/database/db";

export const fetchAllMessagesByConversationId = async (req : Request , res : Response) => {
    const { conversationId } = req.params;

    try {
            const result = await pool.query( `
                SELECT m.id , m.content, m.sender_id , m.conversation_id , m.created_at 
                FROM messages m
                WHERE m.conversation_id =$1 ORDER BY m.created_at ASC `,
                 [conversationId]) ;

             return res.json(result.rows)
    } catch (error) {
        res.status(500).json({error : 'Failed to fetch messages'}) ;
    }
}

export const saveMessage = async (conversationId : string , senderId : string , content : string) => {
    

    try {
            const result = await pool.query( `
                INSERT INTO messages (conversation_id , sender_id , content) VALUES ($1 , $2 , $3) RETURNING *`,
                 [conversationId , senderId , content ]) ;

            return result.rows[0] ;
    } catch (err) {
        console.error('Error saving message' , err)
        throw new Error('Failed to save message')
    } 
}

/*SELECT c.id AS conversation_id,
            CASE 
                WHEN u1.id = $1 THEN u2.username
                ELSE u1.username
            END AS participant_name
            m.content AS last_message, 
            m.created_at AS last_message_time
                 FROM conversations c 
                 JOIN users u ON u1.id = c.participant_one 
                 JOIN users u ON u2.id = c.participant_two AND u.id != $1) 
                 LEFT JOIN LATERAL (
                    SELECT content, created_at FROM  messages WHERE conversation_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 1) m ON true
                WHERE c.participant_one =$1 OR c.participant_two =$1 ORDER BY m.created_at ASC*/