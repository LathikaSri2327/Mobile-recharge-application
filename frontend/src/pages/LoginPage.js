import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiController } from '../controller/apiController';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear form fields and localStorage on mount/refresh
    setFormData({
      email: '',
      password: '',
      rememberMe: false
    });
    setError('');
    
    // Clear any stored form data
    localStorage.removeItem('loginFormData');
    
    // Force clear browser autofill after a short delay
    setTimeout(() => {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    }, 100);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Client-side validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Submitting login:', formData.email);
      await apiController.handleLogin({
        email: formData.email,
        password: formData.password
      }, navigate);
      
      // Clear form fields on successful login
      setFormData({
        email: '',
        password: '',
        rememberMe: false
      });
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message?.includes('Unable to connect')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-card card">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your account</p>
            </div>

            {error && (
              <div className="error-message" style={{background: '#A78295', color: '#EFE1D1', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center'}}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form" autoComplete="new-password">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  autoFocus={false}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="login-footer">
              <div className="divider">
                <span>or</span>
              </div>
              
              <div className="social-login">
                <button className="social-btn google-btn">
                  Continue with Google
                </button>
                <button className="social-btn facebook-btn">
                  Continue with Facebook
                </button>
              </div>

              <p className="signup-link">
                Don't have an account? 
                <Link to="/register"> Sign up here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;