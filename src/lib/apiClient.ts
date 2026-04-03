import axios from 'axios';

// 🚨 Production API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dunex-backend.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach Admin JWT
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// 2. Response Interceptor (Handles session expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401, the token is dead. Redirect to admin login.
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin-login'; 
      }
    }
    return Promise.reject(error);
  }
);