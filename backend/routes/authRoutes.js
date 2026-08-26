import express from 'express';
import { sendOtp, verifyOtp, socialLogin, googleAuth, appleAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/social-login', socialLogin);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);

export default router;

