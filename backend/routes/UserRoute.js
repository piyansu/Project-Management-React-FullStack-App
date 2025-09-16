import express from 'express';
import { registerUser , loginUser , logoutUser , check , googleLogin } from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', check);
router.post('/google-login', googleLogin);

export default router;
