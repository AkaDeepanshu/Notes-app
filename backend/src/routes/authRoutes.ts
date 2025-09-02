import express from 'express';
import { 
  sendOTP, 
  verifyOTP, 
  googleLogin, 
  getMe 
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Auth routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;
