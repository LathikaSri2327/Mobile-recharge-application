import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RechargeYou
            </motion.div>
          </Link>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/offers"
              className={`nav-link ${location.pathname === '/offers' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Offers
            </Link>
            <Link
              to="/feedback"
              className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Feedback
            </Link>
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <span className="user-info">
                  Welcome, {currentUser?.firstName}
                </span>
                <button
                  className="nav-link logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;