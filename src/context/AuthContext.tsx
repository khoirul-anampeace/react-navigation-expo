import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  nip: string;
  department: string;
  position: string;
  joinDate: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status saat app pertama kali load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Check AsyncStorage untuk token/user data
      // const token = await AsyncStorage.getItem('token');
      // const userData = await AsyncStorage.getItem('user');
      
      // Simulasi checking auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Untuk testing, set null (belum login)
      setUser(null);
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Call API login
      // const response = await fetch('YOUR_API_URL/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password })
      // });
      
      // Simulasi login (untuk testing)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dummy user data
      const userData: User = {
        id: '1',
        name: 'Himawari Uzumaki',
        email: email,
        nip: 'EMP25001',
        department: 'IT',
        position: 'Staff',
        joinDate: '1 Februari 2024',
        phone: '0898-7654-321',
        role: 'Admin',
      };

      // TODO: Save token & user data ke AsyncStorage
      // await AsyncStorage.setItem('token', response.token);
      // await AsyncStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Email atau password salah');
    }
  };

  const logout = async () => {
    try {
      // TODO: Call API logout & clear AsyncStorage
      // await AsyncStorage.removeItem('token');
      // await AsyncStorage.removeItem('user');
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};