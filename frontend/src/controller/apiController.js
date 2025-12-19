import { authService } from '../services/authService';
import { rechargeService } from '../services/rechargeService';
import { showSuccess, showError } from '../utils/toast';

export const apiController = {
  // Auth operations
  async handleLogin(credentials, navigate) {
    try {
      const response = await authService.login(credentials);
      showSuccess('Login successful!');
      navigate('/dashboard');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      showError(errorMessage);
      throw error;
    }
  },

  async handleRegister(userData, navigate) {
    try {
      const response = await authService.register(userData);
      showSuccess('Registration successful!');
      navigate('/dashboard');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      showError(errorMessage);
      throw error;
    }
  },

  async handleForgotPassword(emailData) {
    try {
      const response = await authService.forgotPassword(emailData);
      showSuccess('Password reset instructions sent to your email!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      showError(errorMessage);
      throw error;
    }
  },

  // Recharge operations
  async fetchPlans() {
    try {
      return await rechargeService.getPlans();
    } catch (error) {
      showError('Failed to load plans');
      return [];
    }
  },

  async processRecharge(rechargeData) {
    if (!authService.isAuthenticated()) {
      showError('Please login to process recharge');
      throw new Error('Not authenticated');
    }
    try {
      const response = await rechargeService.processRecharge(rechargeData);
      showSuccess('Recharge successful!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Recharge failed';
      showError(errorMessage);
      throw error;
    }
  },

  async payBill(billData) {
    if (!authService.isAuthenticated()) {
      showError('Please login to pay bills');
      throw new Error('Not authenticated');
    }
    try {
      const response = await rechargeService.payBill(billData);
      showSuccess('Bill payment successful!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Bill payment failed';
      showError(errorMessage);
      throw error;
    }
  },

  // Admin Functions
  async getAllUsers() {
    if (!authService.isAdmin()) {
      showError('Admin access required');
      throw new Error('Unauthorized');
    }
    try {
      return await rechargeService.getAllUsers();
    } catch (error) {
      showError('Failed to fetch users');
      throw error;
    }
  },

  async updateUserStatus(userId, status) {
    if (!authService.isAdmin()) {
      showError('Admin access required');
      throw new Error('Unauthorized');
    }
    try {
      const response = await rechargeService.updateUserStatus(userId, status);
      showSuccess(`User ${status} successfully`);
      return response;
    } catch (error) {
      showError('Failed to update user status');
      throw error;
    }
  },

  async getSystemStats() {
    if (!authService.isAdmin()) {
      showError('Admin access required');
      throw new Error('Unauthorized');
    }
    try {
      return await rechargeService.getSystemStats();
    } catch (error) {
      showError('Failed to fetch system stats');
      throw error;
    }
  },

  // Agent Functions
  async getCustomerRecharges() {
    if (!authService.hasAnyRole(['admin', 'agent'])) {
      showError('Agent access required');
      throw new Error('Unauthorized');
    }
    try {
      return await rechargeService.getCustomerRecharges();
    } catch (error) {
      showError('Failed to fetch customer recharges');
      throw error;
    }
  },

  async processCustomerRecharge(rechargeData) {
    if (!authService.hasAnyRole(['admin', 'agent'])) {
      showError('Agent access required');
      throw new Error('Unauthorized');
    }
    try {
      const response = await rechargeService.processCustomerRecharge(rechargeData);
      showSuccess('Customer recharge processed successfully!');
      return response;
    } catch (error) {
      showError('Failed to process customer recharge');
      throw error;
    }
  },

  // Customer Functions
  async getWalletBalance() {
    if (!authService.isAuthenticated()) {
      showError('Please login to view wallet');
      throw new Error('Not authenticated');
    }
    try {
      return await rechargeService.getWalletBalance();
    } catch (error) {
      showError('Failed to fetch wallet balance');
      throw error;
    }
  },

  async addWalletMoney(amount) {
    if (!authService.isAuthenticated()) {
      showError('Please login to add money');
      throw new Error('Not authenticated');
    }
    try {
      const response = await rechargeService.addWalletMoney(amount);
      showSuccess(`₹${amount} added to wallet successfully!`);
      return response;
    } catch (error) {
      showError('Failed to add money to wallet');
      throw error;
    }
  },

  async getRechargeHistory() {
    if (!authService.isAuthenticated()) {
      showError('Please login to view history');
      throw new Error('Not authenticated');
    }
    try {
      return await rechargeService.getRechargeHistory();
    } catch (error) {
      showError('Failed to fetch recharge history');
      throw error;
    }
  }
};