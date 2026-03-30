# 🚀 CodeMentor AI- Full-Stack Web Application

A complete web application with user authentication, code playground, and interactive learning features.

## ✨ Features
- User authentication (signup/login) with JWT
- Code playground supporting multiple languages
- Real code execution via Judge0 API
- AI-powered code assistance
- Responsive design for all devices

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT, Nodemailer
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: Judge0 CE (code execution), Gemini AI (code assistance)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `config.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codingstartup
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=24h
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### 3. Start MongoDB
```bash
mongod
```

### 4. Run Application
```bash
npm run dev
```

Visit: http://localhost:5000

## 📁 Project Structure
- `server.js` - Main server file
- `models/` - MongoDB schemas
- `routes/` - API endpoints
- `middleware/` - Authentication middleware
- `services/` - Email service
- `js/auth.js` - Frontend authentication

## 🔐 API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile

## 🎯 User Flow
1. Visit home page (limited access)
2. Sign up or log in
3. Access code playground and all features
4. Code execution and AI assistance available

## 🔧 Configuration
- Update Gmail credentials in `config.env`
- Set secure JWT secret
- Configure MongoDB connection

## 🐛 Troubleshooting
- Check MongoDB connection
- Verify Gmail SMTP settings
- Clear browser localStorage if needed
- Check server logs for errors

## 📱 Features
- **Authentication**: Secure user management
- **Code Playground**: Multi-language support
- **Real Execution**: Judge0 API integration
- **AI Chatbot**: Gemini AI integration
- **Responsive**: Mobile and desktop optimized

Happy Coding! 🎉
