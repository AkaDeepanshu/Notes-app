import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const sendLoginOTP = async (email: string) => {
  return api.post('/auth/send-login-otp', { email });
};

export const sendSignupOTP = async (email: string) => {
  return api.post('/auth/send-signup-otp', { email });
};

export const verifyLoginOTP = async (data: {
  email: string;
  otp: string;
}) => {
  return api.post('/auth/verify-login-otp', data);
};

export const verifySignupOTP = async (data: {
  email: string;
  otp: string;
  name: string;
  dateOfBirth?: string;
}) => {
  return api.post('/auth/verify-signup-otp', data);
};


export const googleLogin = async (code: string) => {
  return api.post('/auth/google', { code });
};

export const getMe = async () => {
  return api.get('/auth/me');
};

// Notes API
export const getNotes = async () => {
  return api.get('/notes');
};

export const createNote = async (content: string) => {
  return api.post('/notes', { content });
};

export const deleteNote = async (id: string) => {
  return api.delete(`/notes/${id}`);
};

export default api;
