import axios, { type AxiosResponse } from 'axios';
import type { ApiError } from '../types';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.data) {
      // API returned an error response
      const apiError: ApiError = error.response.data;
      throw new Error(apiError.message || apiError.error || 'An error occurred');
    } else if (error.request) {
      // Network error
      throw new Error('Unable to connect to the server. Please check your connection.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export default api;
