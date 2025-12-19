import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiController } from '../controller/apiController';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await apiController.handleForgotPassword({ email });
      setMessage('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-container">
          <div className="forgot-password-card card">
            <div className="forgot-password-header">
              <h1>Reset Password</h1>
              <p>Enter your email to receive reset instructions</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary reset-btn"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>

            <div className="forgot-password-footer">
              <p className="back-link">
                Remember your password? 
                <Link to="/login"> Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;