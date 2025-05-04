import React, { createContext, useState, useContext, useEffect } from 'react';
import { authServices } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));

    console.log('[AuthContext] Initialization - Token exists:', !!token);
    console.log('[AuthContext] Initialization - savedUser:', savedUser);

    if (token && savedUser) {
      console.log('[AuthContext] Setting currentUser from localStorage');
      setCurrentUser(savedUser);
    }

    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    console.log('[AuthContext] Registering user:', userData.email);
    setLoading(true);
    setError('');

    try {
      // Clear any existing auth data before registration
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const response = await authServices.register(userData);
      console.log('[AuthContext] Registration response:', response);

      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      const { token, user } = response.data;

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      console.log('[AuthContext] User registered and set:', user);

      return user;
    } catch (err) {
      console.error('[AuthContext] Registration error:', err);
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    console.log('[AuthContext] Login attempt for:', email);
    setLoading(true);
    setError('');

    try {
      // Clear any existing auth data before login
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const response = await authServices.login({ email, password });
      console.log('[AuthContext] Login response:', response);

      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      const { token, user } = response.data;

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      console.log('[AuthContext] User logged in and set:', user);

      return user;
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      const message = err.response?.data?.message || 'Invalid credentials';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    console.log('[AuthContext] Logging out user');
    setLoading(true);

    try {
      await authServices.logout();
    } catch (err) {
      console.error('[AuthContext] Logout error:', err);
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      console.log('[AuthContext] User logged out, currentUser set to null');
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    console.log('[AuthContext] Updating profile for user:', currentUser.email);
    setLoading(true);
    setError('');

    try {
      const response = await authServices.updateProfile(userData);
      console.log('[AuthContext] Update profile response:', response);
      const updatedUser = response.data.data;

      // Update user in localStorage and state
      const updatedUserData = {
        ...currentUser,
        ...updatedUser
      };

      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setCurrentUser(updatedUserData);
      console.log('[AuthContext] User profile updated:', updatedUserData);

      return updatedUser;
    } catch (err) {
      console.error('[AuthContext] Update profile error:', err);
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update user password
  const updatePassword = async (passwordData) => {
    console.log('[AuthContext] Updating password for user:', currentUser.email);
    setLoading(true);
    setError('');

    try {
      await authServices.updatePassword(passwordData);
      console.log('[AuthContext] Password updated successfully');
    } catch (err) {
      console.error('[AuthContext] Update password error:', err);
      const message = err.response?.data?.message || 'Failed to update password';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // For debugging - log value on every render
  console.log('[AuthContext] Current context value:', {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error
  });

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;