# Mobile Recharge App - Render Deployment Guide

## 🚀 Quick Deploy to Render

### Option 1: Using render.yaml (Recommended)
1. Push code to GitHub repository
2. Connect GitHub repo to Render
3. Render will auto-detect `render.yaml` and deploy both services

### Option 2: Manual Setup

#### Backend Deployment
1. **Create Web Service**
   - Environment: Node.js
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`

2. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-secret>
   ```

3. **Database Setup**
   - Create MongoDB database on Render
   - Copy connection string to MONGODB_URI

#### Frontend Deployment
1. **Create Static Site**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

## 📋 Pre-deployment Checklist

### Backend Updates Needed:
- ✅ Update CORS origins for production
- ✅ Set production MongoDB URI
- ✅ Configure environment variables
- ✅ Update port configuration

### Frontend Updates Needed:
- ✅ Update API base URL for production
- ✅ Build optimization
- ✅ Environment configuration

## 🔧 Production Configuration

### Update Backend CORS:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-url.onrender.com'
];
```

### Update Frontend API URL:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
```

## 🌐 MongoDB Setup
1. Use MongoDB Atlas (free tier)
2. Create cluster and database
3. Get connection string
4. Add to Render environment variables

## 📱 Post-Deployment Testing
1. Test user registration/login
2. Test recharge functionality
3. Test admin dashboard
4. Test feedback system
5. Verify all API endpoints

## 🔗 Useful Links
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)