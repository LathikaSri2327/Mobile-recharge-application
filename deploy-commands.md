# Quick Deployment Commands

## 🚀 Option 1: Two Separate Repositories

### Create Backend Repository
```bash
# Navigate to your project
cd mobile-recharge-app

# Create backend folder
mkdir ../mobile-recharge-backend
cp -r backend/* ../mobile-recharge-backend/
cd ../mobile-recharge-backend

# Initialize git
git init
git add .
git commit -m "Backend deployment ready"

# Push to GitHub (create repo first)
git remote add origin https://github.com/yourusername/mobile-recharge-backend.git
git push -u origin main
```

### Create Frontend Repository
```bash
# Go back to main project
cd ../mobile-recharge-app

# Create frontend folder
mkdir ../mobile-recharge-frontend
cp -r src/ public/ package.json ../mobile-recharge-frontend/
cd ../mobile-recharge-frontend

# Initialize git
git init
git add .
git commit -m "Frontend deployment ready"

# Push to GitHub (create repo first)
git remote add origin https://github.com/yourusername/mobile-recharge-frontend.git
git push -u origin main
```

## 🚀 Option 2: Single Repository Deployment

### Push Current Project
```bash
cd mobile-recharge-app
git init
git add .
git commit -m "Full project deployment ready"
git remote add origin https://github.com/yourusername/mobile-recharge-app.git
git push -u origin main
```

## 📋 Render Deployment Steps

### Backend Deployment:
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. **Settings:**
   - Name: `mobile-recharge-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend` (if single repo)

5. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobile-recharge
   JWT_SECRET=your-super-secret-jwt-key-32-characters
   ```

### Frontend Deployment:
1. Click "New +" → "Static Site"
2. Connect GitHub repository
3. **Settings:**
   - Name: `mobile-recharge-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://mobile-recharge-backend.onrender.com/api
   ```

## ✅ Post-Deployment
- Backend URL: `https://mobile-recharge-backend.onrender.com`
- Frontend URL: `https://mobile-recharge-frontend.onrender.com`
- Test both services are working