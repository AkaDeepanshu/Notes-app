import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useGoogleAuth = () => {
  const { login } = useAuth();

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Ensure we have an access token before proceeding
        if (!tokenResponse.access_token) {
          console.error('No access token received from Google');
          return;
        }
        
        const response = await googleLogin(tokenResponse.access_token);
        login(response.data);
      } catch (error) {
        console.error('Google login failed:', error);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
    },
    flow: 'implicit', // Use implicit flow for simplicity
  });

  return signInWithGoogle;
};
