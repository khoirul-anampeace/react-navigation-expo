import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base URL API
// const API_BASE_URL = 'http://192.168.137.64:5000/api';
const API_BASE_URL = 'http://172.20.10.14:5000/api'; // IP Sindi

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - untuk attach token ke setiap request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - untuk handle refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          console.log('🔄 Token expired, refreshing...');

          // Call refresh token endpoint - using the correct endpoint from your API tests
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          const { accessToken } = response.data;

          // Save new access token
          await AsyncStorage.setItem('accessToken', accessToken);

          console.log('✅ Token refreshed successfully');

          // Retry original request dengan token baru
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } else {
          console.log('❌ No refresh token found, logging out');
          // No refresh token, force logout
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

          // Emit a custom event to notify the app about logout
          // This will help handle logout from any screen
          const { DeviceEventEmitter } = require('react-native');
          DeviceEventEmitter.emit('forceLogout');

          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      } catch (refreshError: any) {
        console.log('❌ Refresh token failed:', refreshError.response?.data || refreshError.message);
        // Refresh token juga expired, logout user
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

        // Emit logout event
        const { DeviceEventEmitter } = require('react-native');
        DeviceEventEmitter.emit('forceLogout');

        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
