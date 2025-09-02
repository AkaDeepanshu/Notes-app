import express from 'express';
import { 
  sendLoginOTP,
  sendSignupOTP,
  verifyLoginOTP,
  verifySignupOTP,
  googleLogin, 
  getMe 
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Auth routes
router.post('/send-login-otp', sendLoginOTP);
router.post('/send-signup-otp', sendSignupOTP);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/verify-signup-otp', verifySignupOTP);


// Other auth routes
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;
