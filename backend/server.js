const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://mobile-recharge-frontend.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile-recharge')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', process.env.MONGODB_URI || 'mongodb://localhost:27017/recharge-app');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('💡 Make sure MongoDB is running: net start MongoDB');
    process.exit(1);
  });

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Mobile Recharge Backend API', status: 'running' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/recharge', require('./routes/recharge'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/agent', require('./routes/agent'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/health', require('./routes/health'));

// Error handling middleware (must be last)
const errorHandler = require('./middleware/errorHandler');

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('💡 Kill existing process or use different port');
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});