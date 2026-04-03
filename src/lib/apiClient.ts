import axios from 'axios';

// 1. Detect environment
const isLocal = typeof window !== 'undefined' && 
                (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// 2. Set Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
                (isLocal ? 'http://localhost:8000/api/v1' : 'https://dunex-backend.onrender.com/api/v1');

export { API_URL };

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor: Attach JWT
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// 🚨 4. NEW: Response Interceptor (Handles session expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401, the token is dead. Redirect to login.
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin-login'; 
      }
    }
    return Promise.reject(error);
  }
);