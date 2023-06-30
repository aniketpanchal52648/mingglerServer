import express from 'express';
import { verifyToken } from "../middleware/auth.js";

import {createChat,userChats,findChat} from '../controllers/chat.js'
const router=express.Router();
router.post('/',verifyToken,createChat);
router.get('/:userId',verifyToken,userChats);
router.get('/find/:firstId/:secondId',verifyToken,findChat);

export default router;