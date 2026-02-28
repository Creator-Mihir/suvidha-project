import axios from 'axios';

// All requests go to API Gateway on port 3000
const API = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('suvidha_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem('suvidha_token');
      localStorage.removeItem('suvidha_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;