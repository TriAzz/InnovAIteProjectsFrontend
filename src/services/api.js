import axios from 'axios';

// For debugging
const API_URL = process.env.REACT_APP_API_URL || 'https://innovaiteprojectsbackend.onrender.com/api';
console.log('[API] Using API URL:', API_URL);

// Create base axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently trying to refresh authentication
let isRefreshingAuth = false;
// Queue of requests waiting for token refresh
let refreshSubscribers = [];

// Execute queued requests after token refresh
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Add to queue of requests waiting for token refresh
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Attempt to silently refresh auth if needed
const refreshAuthIfNeeded = async () => {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshingAuth) {
    return new Promise((resolve) => {
      addRefreshSubscriber(token => {
        resolve(token);
      });
    });
  }
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  // If we have user but no token, try to refresh silently
  if (user && !token) {
    isRefreshingAuth = true;
    try {
      console.log('[API] Attempting to silently refresh authentication');
      const response = await authServices.getProfile();
      if (response && response.data) {
        console.log('[API] Successfully refreshed authentication');
        // Token should be renewed by the interceptor
        isRefreshingAuth = false;
        onTokenRefreshed(localStorage.getItem('token'));
        return localStorage.getItem('token');
      }
    } catch (error) {
      console.error('[API] Failed to refresh authentication:', error);
      // Clear user data if refresh failed
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    isRefreshingAuth = false;
  }
  
  return token;
};

// Add a request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Always try to get the most up-to-date token
    const token = await refreshAuthIfNeeded();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] Request to ${config.url} - Auth token attached`);
    } else {
      console.log(`[API] Request to ${config.url} - No auth token available`);
      
      // Check if we should be authenticated but aren't
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && !token && !config.url.includes('/auth/login')) {
        console.warn('[API] User exists but token is missing, redirecting to login');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('Authentication required'));
      }
    }
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[API] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      console.log('[API] 401 Unauthorized - Clearing user session');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authServices = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/update', userData),
  updatePassword: (passwordData) => api.put('/auth/update-password', passwordData),
  logout: () => api.get('/auth/logout')
};

// Project services
export const projectServices = {
  getAll: (params = {}) => {
    console.log('[API] Calling projectServices.getAll with params:', params);
    return api.get('/projects', { params });
  },
  getById: (id) => {
    console.log(`[API] Fetching project with ID: ${id}`);
    return api.get(`/projects/${id}`);
  },
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  addTeamMember: (id, email) => api.put(`/projects/${id}/team`, { email })
};

export default api;