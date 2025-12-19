import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { apiController } from '../controller/apiController';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreeTerms: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return levels[passwordStrength] || 'Very Weak';
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44'];
    return colors[passwordStrength] || '#ff4444';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Submitting registration:', formData);
      await apiController.handleRegister({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      }, navigate);
      
      // Clear form fields on successful registration
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        agreeTerms: false
      });
      setPasswordStrength(0);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <motion.div 
          className="register-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="register-card card"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="register-header">
              <h1>Create Account</h1>
              <p>Join us for quick mobile recharges</p>
            </div>

            {error && (
              <div className="error-message" style={{background: '#A78295', color: '#EFE1D1', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center'}}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="name-row">
                <motion.div 
                  className="form-group"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    disabled={loading}
                  />
                </motion.div>

                <motion.div 
                  className="form-group"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                    disabled={loading}
                  />
                </motion.div>
              </div>

              <motion.div 
                className="form-group"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
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
                />
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  disabled={loading}
                />
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span 
                      className="strength-text"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="error-text">Passwords do not match</span>
                )}
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.05 }}
              >
                <label htmlFor="role">Account Type</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="role-select"
                >
                  <option value="customer">Customer - Mobile Recharge & Bill Payments</option>
                  <option value="agent">Agent - Help customers with transactions</option>
                  <option value="admin">Admin - System management</option>
                </select>
                <small className="role-description">
                  {formData.role === 'customer' && 'Perfect for personal mobile recharges and bill payments'}
                  {formData.role === 'agent' && 'For business owners helping customers with recharges'}
                  {formData.role === 'admin' && 'Full system access and user management'}
                </small>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkmark"></span>
                  I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                className="btn btn-primary register-btn"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={(e) => {
                  console.log('Button clicked');
                  if (!loading) {
                    handleSubmit(e);
                  }
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </form>

            <motion.div 
              className="register-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <p className="login-link">
                Already have an account? 
                <Link to="/login"> Sign in here</Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;