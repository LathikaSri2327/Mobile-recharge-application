import api from './api';

export const rechargeService = {
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
  },

  processRecharge: async (rechargeData) => {
    const response = await api.post('/recharge', rechargeData);
    return response.data;
  },

  getRechargeHistory: async () => {
    const response = await api.get('/recharge/history');
    return response.data;
  },

  payBill: async (billData) => {
    const response = await api.post('/bills/pay', billData);
    return response.data;
  },

  getBillHistory: async () => {
    const response = await api.get('/bills/history');
    return response.data;
  },

  // Admin Services
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Agent Services
  getCustomerRecharges: async () => {
    const response = await api.get('/agent/recharges');
    return response.data;
  },

  processCustomerRecharge: async (rechargeData) => {
    const response = await api.post('/agent/recharge', rechargeData);
    return response.data;
  },

  // Customer Services
  getWalletBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },

  addWalletMoney: async (amount) => {
    const response = await api.post('/wallet/add', { amount });
    return response.data;
  }
};