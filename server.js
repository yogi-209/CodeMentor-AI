const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let isMongoConnected = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codingstartup', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
    isMongoConnected = true;
    // Update the app.locals after successful connection
    app.locals.isMongoConnected = true;
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Server will run without database. Some features may not work.');
    isMongoConnected = false;
    app.locals.isMongoConnected = false;
});

// Import routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

// Initialize MongoDB connection status for routes
app.locals.isMongoConnected = isMongoConnected;

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: isMongoConnected ? 'connected' : 'disconnected',
        uptime: process.uptime()
    });
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/playground', (req, res) => {
    res.sendFile(path.join(__dirname, 'playground.html'));
});

app.get('/python', (req, res) => {
    res.sendFile(path.join(__dirname, 'python.html'));
});

app.get('/java', (req, res) => {
    res.sendFile(path.join(__dirname, 'java.html'));
});

app.get('/cpp', (req, res) => {
    res.sendFile(path.join(__dirname, 'c++.html'));
});

app.get('/css', (req, res) => {
    res.sendFile(path.join(__dirname, 'css.html'));
});

app.get('/study', (req, res) => {
    res.sendFile(path.join(__dirname, 'study.html'));
});

app.get('/break', (req, res) => {
    res.sendFile(path.join(__dirname, 'break.html'));
});

app.get('/test-chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-chatbot.html'));
});

app.get('/test-api', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-api-simple.html'));
});

app.get('/get-api-key', (req, res) => {
    res.sendFile(path.join(__dirname, 'get-api-key.html'));
});

app.get('/working-chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'working-chatbot.html'));
});

app.get('/test-fixed-chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-fixed-chatbot.html'));
});

app.get('/debug-api', (req, res) => {
    res.sendFile(path.join(__dirname, 'debug-api.html'));
});

app.get('/test-gemini', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-gemini-api.html'));
});

// Serve static files from the root directory (after specific routes)
app.use(express.static(path.join(__dirname)));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
});
