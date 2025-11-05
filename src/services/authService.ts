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

export interface UpdateUserData {
  email?: string;
  password?: string;
  role?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user: User;
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

  // Update user (email, password, role)
  async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    try {
      // Backend require role juga, jadi kita sertakan
      const updatePayload = {
        ...data,
        role: data.role || 'employee', // Default ke 'employee' jika tidak ada
      };

      console.log('📤 Updating user:', { userId, data: updatePayload });
      
      const response = await apiClient.put<UpdateUserResponse>(
        `/auth/users/${userId}`,
        updatePayload
      );

      // Update user di AsyncStorage jika email berubah
      if (data.email && response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      console.log('📥 User updated:', response.data.user);
      return response.data.user;
    } catch (error: any) {
      console.error('❌ Update user error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal mengupdate data user'
      );
    }
  }
}

export default new AuthService();