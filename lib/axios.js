import axios from 'axios';
import { getStoredToken, clearAuth } from './auth';

/**
 * Single Shared Axios Instance
 * Configured with base URL, timeout, request interceptor (token injection),
 * and response interceptor (centralized error handling & 401 redirects).
 */
function getValidBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return 'https://dummyjson.com';
  const clean = raw.trim();
  // Protect against accidental copy-paste typos like dummyjhttps//dummyjson.comson.com
  if (clean.includes('dummyjson.com')) {
    return 'https://dummyjson.com';
  }
  if (!/^https?:\/\//i.test(clean)) {
    return `https://${clean}`;
  }
  return clean.replace(/\/+$/, '');
}

const api = axios.create({
  baseURL: getValidBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach authentication token if available
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling & 401 redirect
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If request was canceled by AbortController, let the caller handle it cleanly
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (expired or invalid token)
    if (error.response && error.response.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    // Extract user-friendly error message
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

export default api;
