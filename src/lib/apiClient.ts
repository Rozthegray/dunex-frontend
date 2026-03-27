import axios from 'axios';

// Point this to your FastAPI server (e.g., http://localhost:8000 or your Render URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dunex-backend.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
