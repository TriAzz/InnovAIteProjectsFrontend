import apiClient from '../services/api';

// Custom hook for making API calls that uses our configured API client
export const useApi = () => {
  const API_URL = 'https://innovaiteprojectsbackend.onrender.com/api';
  
  console.log('API URL being used:', API_URL);

  const makeRequest = async (endpoint, method = 'GET', data = null, headers = {}) => {
    try {
      const url = endpoint.startsWith('/') 
        ? `${API_URL}${endpoint}` 
        : `${API_URL}/${endpoint}`;

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      console.log(`Making ${method} request to: ${url}`);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  return {
    get: (endpoint, headers = {}) => makeRequest(endpoint, 'GET', null, headers),
    post: (endpoint, data, headers = {}) => makeRequest(endpoint, 'POST', data, headers),
    put: (endpoint, data, headers = {}) => makeRequest(endpoint, 'PUT', data, headers),
    delete: (endpoint, headers = {}) => makeRequest(endpoint, 'DELETE', null, headers),
    patch: (endpoint, data, headers = {}) => makeRequest(endpoint, 'PATCH', data, headers),
  };
};

export default useApi;
