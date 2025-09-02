import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/userModel';
import { generateOTP, sendEmail, createOTPEmail } from '../utils/emailService';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

// Send OTP for login or signup
export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with new OTP
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // Create a temporary user entry with OTP
      user = await User.create({
        email,
        name: email.split('@')[0], // Temporary name from email
        otp,
        otpExpires,
      });
    }

    // Send OTP email
    const { text, html } = createOTPEmail(otp);
    const emailSent = await sendEmail(
      email,
      'Your OTP Verification Code',
      text,
      html
    );

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and complete signup
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp, name, dateOfBirth } = req.body;

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

    // Update user information if provided
    if (name) {
      user.name = name;
    }

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
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: 'Google access token is required' });
  }

  try {
    // For access tokens, we need to use the tokeninfo endpoint
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
    
    if (!response.ok) {
      console.error('Google API Error:', await response.text());
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    
    const payload = await response.json();

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
        googleId: payload.sub || payload.user_id || payload.email,
      });
    } else if (!user.googleId) {
      // Link Google ID to existing user account
      user.googleId = payload.sub || payload.user_id || payload.email;
      await user.save();
    }

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
