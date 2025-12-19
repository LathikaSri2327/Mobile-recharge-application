import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    category: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting feedback:', formData);
    
    try {
      const response = await fetch('http://localhost:5002/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({
          name: '',
          email: '',
          rating: 5,
          category: 'general',
          message: ''
        });
      } else {
        const error = await response.json();
        console.error('Server error:', error);
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-wrapper">
        <div className="feedback-header">
          <h1 className="feedback-title">Share Your Feedback</h1>
          <p className="feedback-subtitle">
            Help us improve our service by sharing your experience
          </p>
        </div>

        {submitted && (
          <div className="success-message">
            Thank you for your feedback! We appreciate your input.
          </div>
        )}

        <div className="feedback-content">
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="general">General Feedback</option>
                  <option value="service">Service Quality</option>
                  <option value="technical">Technical Issue</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="form-textarea"
                placeholder="Please share your detailed feedback..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </form>

          <div className="feedback-info">
            <h3>Why Your Feedback Matters</h3>
            <div className="info-grid">
              <div className="info-item">
                <h4>Improve Service</h4>
                <p>Your feedback helps us enhance our recharge services</p>
              </div>
              <div className="info-item">
                <h4>Better Experience</h4>
                <p>We use your suggestions to create better user experiences</p>
              </div>
              <div className="info-item">
                <h4>Quick Response</h4>
                <p>Our team reviews all feedback within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;