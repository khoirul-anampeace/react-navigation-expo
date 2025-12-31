import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base URL API
const API_BASE_URL = 'http://192.168.1.11:5000/api';
// const API_BASE_URL = 'http://192.168.1.14:5000/api'; // IP Sindi

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper to mask tokens in logs (show prefix/suffix only)
const maskToken = (t?: string | null) => {
  if (!t) return null;
  if (t.length <= 12) return `${t.slice(0, 3)}...${t.slice(-3)}`;
  return `${t.slice(0, 6)}...${t.slice(-6)}`;
};

// Request interceptor - untuk attach token ke setiap request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    // Debug: log presence of access token (masked)
    try {
      console.debug('[api] request -> accessToken:', maskToken(token));
    } catch {}
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

    // Log response error details for debugging
    try {
      console.debug('[api] response error -> status:', error.response?.status, 'data:', error.response?.data);
    } catch {}

    // If backend returns 401 OR sends an explicit "Invalid token" message, attempt refresh
    const isAuthError = error.response?.status === 401 || error.response?.data?.message === 'Invalid token';

    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;

      // Implement single-flight refresh: jika sudah ada permintaan refresh, tunggu sampai selesai
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
          console.log('❌ No refresh token found, logging out');
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
          const { DeviceEventEmitter } = require('react-native');
          DeviceEventEmitter.emit('forceLogout');
          return Promise.reject(new Error('Session expired. Please login again.'));
        }

        // If another refresh is running, wait for it
        if ((apiClient as any)._isRefreshing) {
          return new Promise((resolve, reject) => {
            (apiClient as any)._refreshSubscribers.push((token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        // Mark as refreshing and setup subscribers
        (apiClient as any)._isRefreshing = true;
        (apiClient as any)._refreshSubscribers = (apiClient as any)._refreshSubscribers || [];

        console.log('🔄 Token expired or invalid, refreshing via /auth/refresh-token...');
        try {
          console.debug('[api] refresh -> refreshToken:', maskToken(refreshToken));
        } catch {}

        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (!accessToken) {
          throw new Error('No accessToken in refresh response');
        }

        // Save new access token and optionally new refresh token
        await AsyncStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
        }

        console.log('✅ Token refreshed successfully');

        // notify subscribers
        const subs = (apiClient as any)._refreshSubscribers || [];
        subs.forEach((cb: any) => cb(accessToken));
        (apiClient as any)._refreshSubscribers = [];
        (apiClient as any)._isRefreshing = false;

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.log('❌ Refresh token failed:', refreshError.response?.data || refreshError.message);
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        const { DeviceEventEmitter } = require('react-native');
        DeviceEventEmitter.emit('forceLogout');
        (apiClient as any)._isRefreshing = false;
        (apiClient as any)._refreshSubscribers = [];
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
