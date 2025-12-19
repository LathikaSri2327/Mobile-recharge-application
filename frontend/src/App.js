import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';
import Feedback from './pages/Feedback';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';
import './styles/App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route 
              path="/login" 
              element={
                authService.isAuthenticated() ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage />
              } 
            />
            <Route 
              path="/register" 
              element={
                authService.isAuthenticated() ? 
                <Navigate to="/dashboard" replace /> : 
                <RegisterPage />
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                authService.isAuthenticated() ? 
                <Navigate to="/dashboard" replace /> : 
                <ForgotPasswordPage />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;