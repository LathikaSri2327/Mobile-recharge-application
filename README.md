# Mobile Recharge Application

A full-stack mobile recharge application built with React.js frontend and Node.js backend.

## 🚀 Features

### Frontend
- **User Authentication** - Login/Register/Forgot Password
- **Dashboard** - Role-based dashboards (Admin, Agent, Customer)
- **Mobile Recharge** - Quick recharge with multiple operators
- **Plan Management** - View and select recharge plans
- **Offers Page** - Special promotional offers
- **Feedback System** - Customer feedback collection
- **Responsive Design** - Mobile-friendly interface

### Backend
- **RESTful API** - Complete API with authentication
- **User Management** - Multi-role user system
- **Recharge Processing** - Handle recharge transactions
- **Plan Management** - CRUD operations for plans
- **Feedback Collection** - Store and retrieve feedback
- **MongoDB Integration** - Database operations
- **JWT Authentication** - Secure token-based auth

## 🛠️ Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios for API calls
- Framer Motion for animations
- CSS3 with responsive design

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Local Development
```bash
# Clone repository
git clone https://github.com/LathikaSri2327/Mobile-recharge-application-1.git
cd Mobile-recharge-application-1

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Start MongoDB service
net start MongoDB

# Start backend server
npm start

# Start frontend (in new terminal)
cd ..
npm start
```

## 🌐 Deployment

### Render Deployment
1. **Backend**: Deploy as Web Service
2. **Frontend**: Deploy as Static Site
3. **Database**: Use MongoDB Atlas

See `SEPARATE_DEPLOYMENT.md` for detailed instructions.

## 📱 Usage

### User Roles
- **Customer**: Recharge mobile, view history, submit feedback
- **Agent**: Process customer recharges, view statistics
- **Admin**: Manage users, plans, view all data and feedback

### Default Ports
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5002`

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/mobile-recharge
PORT=5002
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Recharge
- `POST /api/recharge` - Process recharge
- `GET /api/recharge/history` - Get recharge history

### Plans
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create plan (Admin)
- `PUT /api/plans/:id` - Update plan (Admin)

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

**Lathika Sri**
- GitHub: [@LathikaSri2327](https://github.com/LathikaSri2327)

## 🙏 Acknowledgments

- React.js community
- Node.js ecosystem
- MongoDB documentation
- Render deployment platform