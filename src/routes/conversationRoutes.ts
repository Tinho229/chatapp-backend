import {  Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { checkOrCreatedConversation, fetchAllConversationsByUser, getDailyQuestion } from "../controllers/conversationsController";


const router = Router() ;

router.get('/' , verifyToken , fetchAllConversationsByUser );
router.post('/check-or-create' , verifyToken , checkOrCreatedConversation );
router.get('/:id/daily-question/' , verifyToken , getDailyQuestion );




export default router ;