# 🚀 CodingStartup Setup Instructions

## Prerequisites
- Node.js (v16 or higher) ✅ Already installed
- npm (v8 or higher) ✅ Already installed

## 🔧 Installation Steps

### 1. Install MongoDB

#### Option A: MongoDB Community Edition (Local Installation)
1. Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Choose "Windows" and "msi" package
3. Run the installer and follow the setup wizard
4. Install MongoDB Compass (GUI tool) if prompted
5. MongoDB will be installed as a Windows service

#### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update `config.env` with your MongoDB Atlas URI

### 2. Configure Environment Variables

Update your `config.env` file:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/codingstartup

# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codingstartup?retryWrites=true&w=majority

# Update Gmail credentials for email functionality
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### 3. Start MongoDB (Local Installation)

If you installed MongoDB locally:
```bash
# MongoDB should start automatically as a Windows service
# To check if it's running:
netstat -an | findstr :27017

# If not running, start it manually:
net start MongoDB
```

### 4. Start the Application

```bash
# Install dependencies (already done)
npm install

# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

## 🧪 Testing the Setup

1. **Check server status**: Visit `http://localhost:5000/api/health`
2. **Test signup**: Go to `http://localhost:5000/signup`
3. **Check console logs** for MongoDB connection status

## 🔍 Troubleshooting

### Common Issues:

#### 1. "Database service is currently unavailable"
- MongoDB is not running
- Check if MongoDB service is started
- Verify connection string in `config.env`

#### 2. "Network error" in signup
- Server is not running
- Check if port 5000 is available
- Run `npm start` to start the server

#### 3. MongoDB connection refused
- MongoDB service not running
- Wrong port (default: 27017)
- Firewall blocking connection

#### 4. Port 5000 already in use
- Change PORT in `config.env`
- Or kill the process using port 5000:
  ```bash
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## 📱 Access URLs

- **Homepage**: http://localhost:5000
- **Signup**: http://localhost:5000/signup
- **Login**: http://localhost:5000/login
- **Playground**: http://localhost:5000/playground
- **Health Check**: http://localhost:5000/api/health

## 🎯 Next Steps

Once MongoDB is connected:
1. Test user registration
2. Test login functionality
3. Explore the code playground
4. Test AI chatbot features

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check if ports are available

Happy Coding! 🎉
