import express from 'express'
const router=express.Router();
import { verifyToken } from "../middleware/auth.js";
import {addMessage,getMessages} from '../controllers/message.js'
router.post('/',verifyToken,addMessage)
router.get('/:chatId',verifyToken,getMessages);
export default router;