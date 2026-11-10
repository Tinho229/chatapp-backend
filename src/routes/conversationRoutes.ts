import {  Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { fetchAllConversationsByUser } from "../controllers/ConersationsController";


const router = Router() ;

router.get('/' , verifyToken , fetchAllConversationsByUser );



export default router ;