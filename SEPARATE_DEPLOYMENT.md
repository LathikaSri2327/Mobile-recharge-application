# Separate Frontend & Backend Deployment on Render

## 🔧 Method 1: Two Separate GitHub Repositories (Recommended)

### Step 1: Create Two Repositories
```bash
# Create backend repository
mkdir mobile-recharge-backend
cp -r backend/* mobile-recharge-backend/
cd mobile-recharge-backend
git init
git add .
git commit -m "Backend initial commit"
git remote add origin <backend-repo-url>
git push -u origin main

# Create frontend repository  
mkdir mobile-recharge-frontend
cp -r src/ public/ package.json mobile-recharge-frontend/
cd mobile-recharge-frontend
git init
git add .
git commit -m "Frontend initial commit"
git remote add origin <frontend-repo-url>
git push -u origin main
```

### Step 2: Deploy Backend
1. **Go to Render Dashboard**
2. **Click "New +" → "Web Service"**
3. **Connect Backend Repository**
4. **Configuration:**
   - **Name:** `mobile-recharge-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-random-32-char-string>
   ```

6. **Deploy** - Note the backend URL (e.g., `https://mobile-recharge-backend.onrender.com`)

### Step 3: Deploy Frontend
1. **Click "New +" → "Static Site"**
2. **Connect Frontend Repository**
3. **Configuration:**
   - **Name:** `mobile-recharge-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://mobile-recharge-backend.onrender.com/api
   ```

5. **Deploy**

## 🔧 Method 2: Single Repository with Manual Configuration

### Step 1: Deploy Backend
1. **New Web Service**
2. **Connect Repository**
3. **Root Directory:** `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Environment Variables:** (same as above)

### Step 2: Deploy Frontend
1. **New Static Site**
2. **Connect Same Repository**
3. **Root Directory:** `/` (root)
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `build`
6. **Environment Variables:** (same as above)

## 📋 Pre-Deployment Setup

### Backend Package.json
```json
{
  "name": "mobile-recharge-backend",
  "scripts": {
    "start": "node server.js",
    "build": "npm install"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Frontend Package.json
```json
{
  "scripts": {
    "build": "react-scripts build"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🌐 MongoDB Atlas Setup
1. **Create Account:** [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster** (Free M0)
3. **Create Database User**
4. **Whitelist IP:** `0.0.0.0/0` (Allow all)
5. **Get Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mobile-recharge?retryWrites=true&w=majority
   ```

## 🔗 Update CORS for Production
In `backend/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://mobile-recharge-frontend.onrender.com'
];
```

## ✅ Deployment Checklist
- [ ] MongoDB Atlas database created
- [ ] Backend deployed and running
- [ ] Frontend deployed with correct API URL
- [ ] CORS updated for frontend domain
- [ ] Environment variables configured
- [ ] Test all functionality

## 🚀 Quick Commands
```bash
# Test backend
curl https://mobile-recharge-backend.onrender.com/health

# Test frontend
curl https://mobile-recharge-frontend.onrender.com
```