import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;