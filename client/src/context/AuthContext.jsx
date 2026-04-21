/**
 * Authentication Context
 * Global state management for user authentication and JWT token
 * Provides login, register, logout functionality and user data
 * Token automatically retrieved on app mount from localStorage
 */

import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps app to provide authentication context to all child components
 * Automatically checks for existing session on mount
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current authenticated user or null
  const [loading, setLoading] = useState(true); // Loading state during auth check

  /**
   * Check if user is already authenticated on app mount
   * Verifies token from localStorage by calling /auth/me endpoint
   * If verification fails or no token, user remains null
   */
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Auth verification failed', error);
          localStorage.removeItem('token'); // Clear invalid token
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {object} User object with token
   */
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token); // Store token for future requests
    setUser(data); // Update global user state
    return data;
  };

  /**
   * Register new user account
   * @param {object} userData - {name, email, password, skillsToTeach, skillsToLearn}
   * @returns {object} User object with token
   */
  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  /**
   * Logout current user
   * Clears token from storage and resets user state
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
