import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const credentials = btoa(`${email}:${password}`);
      
      // Use the configured apiClient which is already set up with the correct backend URL
      const userData = await apiClient.get('/users/me', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      // If we get here, the request was successful
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authCredentials', credentials);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authCredentials');
  };

  const register = async (userData) => {
    try {
      // Use the configured apiClient instead of fetch
      await apiClient.post('/users', {
        email: userData.email,
        passwordHash: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        description: userData.description,
        role: 'User'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const getAuthHeaders = () => {
    const credentials = localStorage.getItem('authCredentials');
    if (credentials) {
      return {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  };

  const value = {
    user,
    login,
    logout,
    register,
    getAuthHeaders,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
