import exress from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriends
} from "../controllers/user.js";

import { verifyToken } from "../middleware/auth.js";

const router=exress.Router();
router.get('/:id',verifyToken,getUser);
router.get('/:id/friends',verifyToken,getUserFriends);
router.patch('/:id/:friendId',verifyToken,addRemoveFriends);
export default router
