import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // required for httpOnly refresh cookies
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Normalize error shape to always return a clean error message
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
      originalError: error,
    };

    // If unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop if refreshing fails
      if (originalRequest.url === '/auth/refresh-token' || originalRequest.url === '/auth/login') {
        return Promise.reject(normalizedError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Trigger silent refresh
        const refreshResponse = await axios.post(
          '/api/v1/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = refreshResponse.data.data;

        // Update Zustand Store
        useAuthStore.getState().setUser(user, accessToken);

        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear auth store if refresh fails (session expired)
        useAuthStore.getState().logoutStore();
        
        return Promise.reject({
          message: 'Session expired. Please sign in again.',
          status: 401,
          originalError: refreshError,
        });
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
