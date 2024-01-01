import express from 'express';
const router = express.Router();
import { signUp, login, logout, getAllUsers } from "../controllers/user.js";
import { checkToken, checkRole } from '../middlewares/middlewares.js';

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", checkToken, logout);
router.get('/', checkToken, checkRole(['admin', 'manager']), getAllUsers);

export default router;
