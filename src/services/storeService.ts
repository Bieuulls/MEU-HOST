import axios from 'axios';
import { Product } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced retry configuration
api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;

  // Handle network errors (like ECONNREFUSED)
  if (!response && error.code === 'ECONNREFUSED') {
    throw new Error('Unable to connect to the server. Please check if the server is running.');
  }

  if (!config) return Promise.reject(error);

  // Retry on connection timeout, server errors, or network errors
  if (
    response?.status === 504 ||
    (response?.status >= 500 && response?.status <= 599) ||
    error.code === 'ECONNABORTED'
  ) {
    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount < 3) { // Increased to 3 retries
      config.__retryCount += 1;

      // Exponential backoff with jitter
      const backoffDelay = Math.min(1000 * Math.pow(2, config.__retryCount) + Math.random() * 1000, 10000);

      return new Promise((resolve) => {
        setTimeout(() => resolve(api(config)), backoffDelay);
      });
    }
  }

  return Promise.reject(error);
});

export const storeService = {
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        if (error.code === 'ECONNABORTED' || error.response.status === 504) {
          throw new Error('Request timed out. The server is taking too long to respond.');
        }
        if (error.response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw new Error('Failed to load featured products. Please try again.');
    }
  },
};