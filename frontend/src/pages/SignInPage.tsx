import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { sendOTP, verifyOTP } from "../services/api";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import logo from "../assets/icon.png";
import background from "../assets/background.png";

export const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const signInWithGoogle = useGoogleAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      await sendOTP(email);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOTP({ email, otp });
      login(response.data);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowOtp = () => {
    setShowOtp(!showOtp);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await sendOTP(email);
      setOtpSent(true);
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Logo at top left */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 md:left-3 md:transform-none md:translate-x-0 z-10">
        <div className="flex gap-2">
          <img src={logo} alt="Logo" className="w-7 h-7" />
          <h1 className="text-lg font-semibold">HD</h1>
        </div>
      </div>

      {/* Left Side Form */}
      <div className="w-full md:w-[40%] px-12 py-8 flex flex-col justify-center">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl text-center md:text-left font-bold mb-2">
            Sign in
          </h2>
          <p className="text-gray-400 text-center md:text-left text-base mb-5">
            Please login to continue to your account.
          </p>

          <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
            <InputField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {otpSent && (
              <>
                <InputField
                  label="OTP"
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  icon={
                    <button type="button" onClick={toggleShowOtp}>
                      {showOtp ? <FiEyeOff /> : <FiEye />}
                    </button>
                  }
                />
                <div className="block text-left">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-blue-500 cursor-pointer underline"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>

                <div className="flex items-center my-4">
                  <input
                    id="keep-logged"
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer accent-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="keep-logged"
                    className="ml-2 cursor-pointer text-sm text-gray-600"
                  >
                    Keep me logged in
                  </label>
                </div>
              </>
            )}
            <Button type="submit" fullWidth isLoading={loading}>
              {otpSent ? "Sign in" : "Get OTP"}
            </Button>
          </form>

          <div>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                or sign in with
              </span>
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

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Need an account?{" "}
              <Link to="/signup" className="text-blue-500 underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side Image*/}
      <div className="hidden md:block md:w-[60%] bg-pattern">
        <div className="h-screen flex items-center justify-center">
          <img
            src={background}
            alt="Background Image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
