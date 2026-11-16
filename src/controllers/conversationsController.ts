import { Request, Response } from "express";
import pool from "../config/database/db";

export const fetchAllConversationsByUser = async (req: Request, res: Response): Promise<any> => {
    let userId = null;
    
    if (req.user) {
        userId = req.user.id;
    }

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const result = await pool.query(
            `SELECT c.id AS conversation_id,
            CASE 
                WHEN u1.id = $1 THEN u2.username
                ELSE u1.username
            END AS participant_name,
            CASE
                WHEN u1.id = $1 THEN u2.profil_img
                ELSE u1.profil_img
            END AS participant_image,
            COALESCE(m.content, '') AS last_message, 
            COALESCE(m.created_at, c.created_at) AS last_message_time
                 FROM conversations c 
                 JOIN users u1 ON u1.id = c.participant_one 
                 JOIN users u2 ON u2.id = c.participant_two  
                 LEFT JOIN LATERAL (
                    SELECT content, created_at FROM messages WHERE conversation_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 1) m ON true
                WHERE c.participant_one = $1 OR c.participant_two = $1 
                ORDER BY m.created_at DESC NULLS LAST`,
            [userId]
        );

        return res.json(result.rows);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ error: "Failed to fetch conversations" });
    }
};

export const checkOrCreatedConversation = async (req: Request, res: Response): Promise<any> => {
    let userId = null;

    if (req.user) {
        userId = req.user.id;
    }

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { contactId } = req.body;
    if (!contactId) {
        return res.status(400).json({ error: "contactId is required" });
    }

    try {
        const existingConversation = await pool.query(
            `SELECT id FROM conversations
             WHERE (participant_one = $1 AND participant_two = $2)
                OR (participant_one = $2 AND participant_two = $1) LIMIT 1`,
            [userId, contactId]
        );

        if (existingConversation.rowCount != null && existingConversation.rowCount > 0) {
            return res.json({ conversationId: existingConversation.rows[0].id });
        }

        const newConversation = await pool.query(
            `INSERT INTO conversations (participant_one, participant_two) 
             VALUES ($1, $2) RETURNING id`,
            [userId, contactId]
        );

        return res.json({ conversationId: newConversation.rows[0].id });
    } catch (error) {
        console.error('Error checking or creating conversation:', error);
        return res.status(500).json({ error: 'Failed to check or create conversation' });
    }
};

export const getDailyQuestion = async (req: Request, res: Response): Promise<any> => {
    const conversationId = req.params.id;
    try {
        const result = await pool.query(
            `SELECT m.content
             FROM messages m
             WHERE m.conversation_id = $1
               AND m.sender_id = $2
             ORDER BY m.created_at DESC
             LIMIT 1`,
            [conversationId, process.env.AI_BOT_ID]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No daily question found' });
        }

        return res.json({ question: result.rows[0].content });
    } catch (error) {
        console.error('Error fetching daily question:', error);
        return res.status(500).json({ error: 'Failed to fetch daily questions' });
    }
};
