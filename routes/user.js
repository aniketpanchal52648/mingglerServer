import exress from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriends,
    getUsers
} from "../controllers/user.js";

import { verifyToken } from "../middleware/auth.js";

const router=exress.Router();
router.get('/:id',verifyToken,getUser);
router.get('/:id/friends',verifyToken,getUserFriends);
router.patch('/:id/:friendId',verifyToken,addRemoveFriends);
router.get('/find/:searchValue',verifyToken,getUsers);
export default router
