import express from 'express';
import { registerUser, loginUser, logoutUser, check, googleLogin, getUserById, updateUserProfile } from '../controllers/UserController.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', check);
router.put('/profile', upload.single('profilePhoto'), updateUserProfile);
router.post('/google-login', googleLogin);
router.get('/:userId', getUserById);

export default router;
