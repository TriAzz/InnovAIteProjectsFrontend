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
  withCredentials: true, // Important for CORS with credentials
});

// Simple function to get the current token
const getToken = () => {
  return localStorage.getItem('token');
};

// Add a request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Always try to get the most up-to-date token
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] Request to ${config.url} - Auth token attached`);
    } else {
      console.log(`[API] Request to ${config.url} - No auth token available`);

      // Check if we should be authenticated but aren't
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && !token && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
        console.warn('[API] User exists but token is missing, redirecting to login');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
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

      // Only redirect to login if we're not already on the login or register page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication services
export const authServices = {
  register: (userData) => {
    console.log('[API] Sending registration request with data:', userData);
    return api.post('/auth/register', userData);
  },
  login: (credentials) => {
    console.log('[API] Sending login request with credentials:', { email: credentials.email, passwordLength: credentials.password?.length });
    return api.post('/auth/login', credentials);
  },
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