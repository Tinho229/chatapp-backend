import { Request, Response, Router } from "express";

import pool from "../config/database/db";
import { verifyToken } from "../middlewares/authMiddleware";
import { fetchAllConversationsByUser } from "../controllers/ConersationsController";


const router = Router() ;

router.get('/' , verifyToken , fetchAllConversationsByUser );



export default router ;