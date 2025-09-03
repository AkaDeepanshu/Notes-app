import nodemailer from 'nodemailer';

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: 'HD Notes App <no-reply@hdnotes.com>',
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTPEmail = (otp: string): { text: string; html: string } => {
  const text = `Your verification code is ${otp}. It will expire in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4361ee;">HD Notes App</h2>
      <p>Your verification code is:</p>
      <h1 style="font-size: 40px; letter-spacing: 5px; text-align: center; margin: 20px 0;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  `;

  return { text, html };
};
