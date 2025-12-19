import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  forgotPassword: async (emailData) => {
    const response = await api.post('/auth/forgot-password', emailData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginFormData');
    localStorage.removeItem('registerFormData');
    // Clear any browser stored form data
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
      }, 100);
    }
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser'));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.role === role;
  },

  hasAnyRole: (roles) => {
    const user = authService.getCurrentUser();
    return user && roles.includes(user.role);
  },

  isAdmin: () => {
    return authService.hasRole('admin');
  },

  isAgent: () => {
    return authService.hasRole('agent');
  },

  isCustomer: () => {
    return authService.hasRole('customer');
  }
};