import {  Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { checkOrCreatedConversation, fetchAllConversationsByUser } from "../controllers/conversationsController";


const router = Router() ;

router.get('/' , verifyToken , fetchAllConversationsByUser );
router.post('/check-or-create' , verifyToken , checkOrCreatedConversation );



export default router ;