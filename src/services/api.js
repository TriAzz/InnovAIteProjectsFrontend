import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5295/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth headers
apiClient.interceptors.request.use(
  (config) => {
    const credentials = localStorage.getItem('authCredentials');
    
    if (credentials) {
      config.headers.Authorization = `Basic ${credentials}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Projects API
export const projectsAPI = {
  getAll: () => apiClient.get('/projects'),
  getById: (id) => apiClient.get(`/projects/${id}`),
  getByUserId: (userId) => apiClient.get(`/projects/user/${userId}`),
  getMyProjects: () => apiClient.get('/projects/my-projects'),
  create: (project) => apiClient.post('/projects', project),
  update: (id, project) => apiClient.put(`/projects/${id}`, project),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

// Comments API
export const commentsAPI = {
  getAll: () => apiClient.get('/comments'),
  getById: (id) => apiClient.get(`/comments/${id}`),
  getByProjectId: (projectId) => apiClient.get(`/comments/project/${projectId}`),
  getApprovedByProjectId: (projectId) => apiClient.get(`/comments/project/${projectId}/approved`),
  create: (comment) => apiClient.post('/comments', comment),
  update: (id, comment) => apiClient.put(`/comments/${id}`, comment),
  delete: (id) => apiClient.delete(`/comments/${id}`),
  approve: (id) => apiClient.patch(`/comments/${id}/approve`),
  unapprove: (id) => apiClient.patch(`/comments/${id}/unapprove`),
};

// Users API
export const usersAPI = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  getAdmins: () => apiClient.get('/users/admins'),
  getCurrentUser: () => apiClient.get('/users/me'),
  create: (user) => apiClient.post('/users', user),
  update: (id, user) => apiClient.put(`/users/${id}`, user),
  delete: (id) => apiClient.delete(`/users/${id}`),
  updateSecurity: (id, loginData) => apiClient.patch(`/users/${id}/security`, loginData),
  setupAdmin: (userData) => apiClient.post('/users/setup-admin', userData),
};

export default apiClient;
