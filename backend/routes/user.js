import express from 'express';
const router = express.Router();
import { signUp, login, logout, getAllUsers } from "../controllers/user.js";
import { checkToken } from '../middlewares/token.js';

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", checkToken, logout);
router.get('/', getAllUsers);

export default router;
