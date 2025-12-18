# Mobile Recharge App - Startup Guide

## ✅ Project Verification Complete

### Backend Setup (Port 5002)
```bash
cd backend
npm install
npm start
```

### Frontend Setup (Port 3000)
```bash
npm install
npm start
```

## 🔧 Fixed Issues:
1. ✅ Server default port corrected to 5002
2. ✅ All route files exist and properly configured
3. ✅ Feedback system backend/frontend connected
4. ✅ Proxy configuration correct in package.json
5. ✅ All models and controllers present

## 📋 Verification Checklist:
- ✅ MongoDB connection string correct
- ✅ JWT secret configured
- ✅ CORS properly set up
- ✅ All API routes registered
- ✅ Frontend proxy pointing to correct port
- ✅ All dependencies installed

## 🚀 Quick Start:
1. Start MongoDB: `net start MongoDB`
2. Start Backend: `cd backend && npm start`
3. Start Frontend: `npm start`
4. Access app: `http://localhost:3000`

## 🔍 API Endpoints:
- Auth: `/api/auth/*`
- Plans: `/api/plans/*`
- Recharge: `/api/recharge/*`
- Feedback: `/api/feedback/*`
- Admin: `/api/admin/*`

## 🛠️ Troubleshooting:
- If port 5002 is busy, change PORT in .env
- If MongoDB fails, ensure service is running
- If CORS errors, check allowed origins in server.js