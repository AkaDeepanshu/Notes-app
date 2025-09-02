import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/userModel';
import { generateOTP, sendEmail, createOTPEmail } from '../utils/emailService';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

// Send OTP for login (only for existing users)
export const sendLoginOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user exists - login OTP should only be sent to registered users
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email. Please sign up first.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update existing user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    const { text, html } = createOTPEmail(otp);
    const emailSent = await sendEmail(
      email,
      'Your Login OTP Verification Code',
      text,
      html
    );

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.status(200).json({ message: 'Login OTP sent successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Send OTP for signup (for new users)
export const sendSignupOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, this should be a login, not signup
      return res.status(409).json({ message: 'Account already exists with this email. Please sign in instead.' });
    }

    // Create a temporary user entry with OTP for signup
    user = await User.create({
      email,
      name: email.split('@')[0], // Temporary name from email
      otp,
      otpExpires,
    });

    // Send OTP email
    const { text, html } = createOTPEmail(otp);
    const emailSent = await sendEmail(
      email,
      'Your Signup OTP Verification Code',
      text,
      html
    );

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.status(200).json({ message: 'Signup OTP sent successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP for login
export const verifyLoginOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id as string);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and complete signup
export const verifySignupOTP = async (req: Request, res: Response) => {
  const { email, otp, name, dateOfBirth } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required for signup' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please request OTP again.' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update user information with provided data
    user.name = name;
    if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth);
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id as string);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// Login with Google
export const googleLogin = async (req: Request, res: Response) => {
 const { code } = req.body;
  if (!code) return res.status(400).json({ message: "Authorization code is required" });

  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    // Check if user exists
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name: payload.name || payload.email?.split('@')[0],
        email: payload.email,
        googleId: payload.sub || payload.email,
      });
    } else if (!user.googleId) {
      // Link Google ID to existing user account
      user.googleId = payload.sub|| payload.email;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id as string);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-otp -otpExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
