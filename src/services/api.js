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

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] Request to ${config.url} - Auth token attached`);
    } else {
      console.log(`[API] Request to ${config.url} - No auth token available`);
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
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  addTeamMember: (id, email) => api.put(`/projects/${id}/team`, { email })
};

export default api;