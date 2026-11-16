import cron from 'node-cron';
import pool from '../../config/database/db';
import { generateDailyQuestion } from '../../services/onpenaiService';

export const startDailyQuestionJob = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('--- Lancement du job: question quotidienne ---');
            const conversations = await pool.query('SELECT id FROM conversations');
            if (conversations.rowCount === 0) return;

            const question = await generateDailyQuestion();

            for (const conversation of conversations.rows) {
                await pool.query(
                    `INSERT INTO messages (conversation_id, sender_id, content) 
                     VALUES ($1, $2, $3)`,
                    [conversation.id, process.env.AI_BOT_ID, question]
                );
                console.log(`Daily question sent for conversation ${conversation.id}`);
            }
        } catch (error) {
            console.error('Error in daily question job ', error);
        }
    });
};
