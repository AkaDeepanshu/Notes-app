# 📝 HD Notes App

A modern, full-stack notes application built with React, TypeScript, Node.js, and MongoDB. The app features secure authentication (Google OAuth & OTP), real-time note management, and a beautiful, responsive UI.

## 🌟 Features

- **Secure Authentication**: 
  - Email/OTP verification system
  - Google OAuth integration
  - JWT-based session management
- **Note Management**: 
  - Create, read, and delete notes
  - Real-time updates
  - User-specific note storage
- **Modern UI/UX**: 
  - Responsive design with Tailwind CSS
  - Floating label inputs
  - Toast notifications
  - Error boundaries for better user experience
- **Type Safety**: Full TypeScript implementation across frontend and backend

## 🚀 Live Demo

🔗 **[Visit HD Notes App](https://notes-app-fr.netlify.app/)** 

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **React OAuth Google** - Google authentication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **Google Auth Library** - Google OAuth

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) 
- **MongoDB** (v6.0 or higher) or MongoDB Atlas account
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AkaDeepanshu/Notes-app.git
cd Notes-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
# or create .env file manually
```

### 3. Configure Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URL= your_mongodb_url

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=postmessage
```

### 4. Build and Start Backend

```bash
# Build TypeScript files
npm run build

# Start the server
npm start

# For development (with auto-reload)
npm run dev
```

The backend server will start on `http://localhost:5000`

### 5. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 6. Configure Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth Client ID (same as backend)
VITE_CLIENT_ID=your-google-client-id
```

### 7. Build and Start Frontend

```bash
# For development
npm run dev

# For production build
npm run build

# Preview production build
npm run preview
```

The frontend will start on `http://localhost:5173`

## 🔧 Build Instructions

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### Production Build

1. **Build Backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Serve Frontend:**
   ```bash
   npm run preview
   # or serve the dist/ folder with your preferred web server
   ```

## 📁 Project Structure

```
Notes-app/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   ├── dist/               # Compiled JavaScript files
│   └── package.json
│
├── frontend/               # React frontend app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── main.tsx        # App entry point
│   ├── dist/               # Built files for production
│   └── package.json
│
└── README.md              # Project documentation
```

## 🔐 Environment Setup Guide

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173` and your production URL
6. Copy the Client ID and Client Secret to your `.env` files

### Email Service Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in `EMAIL_PASS` environment variable

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/notes-app`

#### Option 2: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to `MONGODB_URL`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/send-login-otp` - Send OTP for existing users
- `POST /api/auth/send-signup-otp` - Send OTP for new users
- `POST /api/auth/verify-login-otp` - Verify login OTP
- `POST /api/auth/verify-signup-otp` - Verify signup OTP
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get user profile

### Notes
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/:id` - Delete note

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Deepanshu Sharma (AkaDeepanshu)**
- GitHub: [@AkaDeepanshu](https://github.com/AkaDeepanshu)

## 🙏 Acknowledgments

- Thanks to all contributors and testers
- Built with modern web technologies
- Inspired by the need for a simple, secure note-taking solution

---

⭐ **If you found this project helpful, please give it a star!** ⭐
