import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>RechargeYou</h3>
            <p>Quick and secure mobile recharge solution</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <motion.a
                href="#facebook"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                Facebook
              </motion.a>
              <motion.a
                href="#twitter"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                Twitter
              </motion.a>
              <motion.a
                href="#instagram"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                Instagram
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 RechargeApp. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;