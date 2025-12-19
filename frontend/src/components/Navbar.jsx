import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              RechargeWave
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/plans" className="text-gray-700 hover:text-primary transition-colors">
              Plans
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-primary transition-colors">
              Offers
            </Link>
            <Link to="/support" className="text-gray-700 hover:text-primary transition-colors">
              Support
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary hover:text-white transition-all"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;