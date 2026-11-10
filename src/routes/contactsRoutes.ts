import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { addContact, fetchContacts } from "../controllers/conctatsControllers";


const router = Router() ;

router.get('/' , verifyToken , fetchContacts);
router.post('/' , verifyToken , addContact);




export default router ;