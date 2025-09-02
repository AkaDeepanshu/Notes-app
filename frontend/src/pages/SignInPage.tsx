import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { Layout, Content, ImageSide } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { sendOTP, verifyOTP } from '../services/api';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const signInWithGoogle = useGoogleAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendOTP(email);
      setOtpSent(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyOTP({ email, otp });
      login(response.data);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowOtp = () => {
    setShowOtp(!showOtp);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      await sendOTP(email);
      setOtpSent(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Content>
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white font-bold">HD</span>
          </div>
          <h1 className="text-xl font-semibold">HD</h1>
        </div>

        <h2 className="text-3xl font-bold mb-2">Sign in</h2>
        <p className="text-gray-500 mb-6">Please login to continue to your account.</p>

        {!otpSent ? (
          <form onSubmit={handleSendOTP}>
            <InputField
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <Button type="submit" fullWidth isLoading={loading}>
              Get OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <InputField
              label="OTP"
              type={showOtp ? "text" : "password"}
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              icon={
                <button type="button" onClick={toggleShowOtp}>
                  {showOtp ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <Button type="submit" fullWidth isLoading={loading}>
              Sign in
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-500 hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center my-6">
          <input
            id="keep-logged"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="keep-logged" className="ml-2 text-sm text-gray-600">
            Keep me logged in
          </label>
        </div>

        <div className="mt-4">
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400">or sign in with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => signInWithGoogle()}
          >
            <div className="flex items-center justify-center">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </div>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Need an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </Content>
      <ImageSide />
    </Layout>
  );
};
