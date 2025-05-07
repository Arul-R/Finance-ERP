import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5003/api',  // Updated to match client service port
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
