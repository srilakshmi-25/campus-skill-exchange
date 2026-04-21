/**
 * API Service Module
 * Axios instance with automatic JWT token injection
 * Handles all HTTP requests to backend API with auth headers
 */

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API base URL (use env var in production)
});

/**
 * Request Interceptor
 * Automatically attaches JWT token from localStorage to all requests
 * Token is included in Authorization header in format: Bearer {token}
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
