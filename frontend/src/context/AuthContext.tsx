import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getMe } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth?: Date;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: { token: string } & User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (userData: { token: string } & User) => {
    localStorage.setItem('token', userData.token);
    setToken(userData.token);
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      try {
        if (token) {
          const response = await getMe();
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to verify token', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
