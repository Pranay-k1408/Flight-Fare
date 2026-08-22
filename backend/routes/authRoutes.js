import express from 'express';
import { sendOtp, verifyOtp, socialLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/social-login', socialLogin);

export default router;
