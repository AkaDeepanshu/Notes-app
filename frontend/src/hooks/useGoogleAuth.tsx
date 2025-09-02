import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { googleLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const useGoogleAuth = () => {
  const { login } = useAuth();

  const responseGoogle = async (authResponse:any) => {
    try {
      if (authResponse["code"]) {
        console.log("Google auth code:", authResponse.code);
        const response = await googleLogin(authResponse.code);
        login(response.data);
      }
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error("Google authentication failed. Please try email/OTP login instead.");
    }
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google OAuth error:", error);
      toast.error("Google authentication is currently unavailable. Please use email/OTP login.");
    },
    flow: "auth-code",
  });

  return signInWithGoogle;
};
