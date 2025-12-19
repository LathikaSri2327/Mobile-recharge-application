# Mobile Recharge Application

A full-stack mobile recharge application with React frontend and Node.js backend.

## Project Structure

```
mobile-recharge-app/
├── backend/          # Node.js/Express API server
├── frontend/         # React application
└── README.md
```

## Deployment

### Backend (Render)
- Repository: This repo
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend (Render/Netlify)
- Repository: This repo  
- Root Directory: `frontend`
- Build Command: `npm run build`
- Publish Directory: `build`

## Environment Variables

### Backend
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: JWT secret key
- `PORT`: Server port (auto-assigned by Render)

### Frontend
- `REACT_APP_API_URL`: Backend API URL