import {  Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { checkOrCreatedConversation, fetchAllConversationsByUser } from "../controllers/ConersationsController";


const router = Router() ;

router.get('/' , verifyToken , fetchAllConversationsByUser );
router.get('/check-or-create' , verifyToken , checkOrCreatedConversation );



export default router ;