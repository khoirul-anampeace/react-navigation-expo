import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface User {
  id: number;
  email: string;
  role: string;
}

class AuthService {
  // Login function
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      );

      const { accessToken, refreshToken, user } = response.data;

      // Simpan ke AsyncStorage
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login gagal');
    }
  }

  // Logout function
  async logout(): Promise<void> {
    try {
      // Hapus semua data dari AsyncStorage
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Check if user is logged in
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Get current user from storage
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();