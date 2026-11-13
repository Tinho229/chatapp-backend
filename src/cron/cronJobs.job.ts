import cron  from 'node-cron' ;
import pool from '../config/database/db';
import { generateDailyQuestion } from '../services/onpenaiService';

cron.schedule('* * * * *' , async () => {
    try {
        const conversations = await pool.query('SELECT id FROM conversations') ;
        for(const conversation of conversations.rows) {
            const question = await generateDailyQuestion() ;
            await pool.query(`
                INSERT INTO messages (conversation_id , sender_id , content) 
                VALUES ($1 , $2, $3)
                `, [conversation.id , process.env.AI_BOT_ID ,  question] ) ;
                console.log(`Daily question sent for conversation ${conversation.id}`);

        }   
        
    } catch (error) {
        console.error('Error in daily question job ' , error);
        
    }
}) ;