import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AuthService from '../services/authService';
import EmployeeService from '../services/employeeService';

interface User {
  id: number;
  email: string;
  role: string;
  employee?: {
    id: number;
    full_name: string;
    department: string;
    position: string;
    phone: string;
    employee_code: string;
  };
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
      setIsLoading(true);
      const isAuth = await AuthService.isAuthenticated();

      if (isAuth) {
        const userData = await AuthService.getCurrentUser();
        if (userData) {
          // Get employee data to complete profile
          try {
            const employeeData = await EmployeeService.getEmployeeByUserId(userData.id);
            setUser({
              ...userData,
              employee: {
                id: employeeData.id,
                full_name: employeeData.full_name,
                department: employeeData.department,
                position: employeeData.position,
                phone: employeeData.phone,
                employee_code: employeeData.employee_code,
              }
            });
          } catch (error) {
            console.error('Error loading employee data:', error);
            // Still set user even if employee data fails
            setUser(userData);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loginResponse = await AuthService.login({ email, password });

      // Get employee data after successful login
      try {
        const employeeData = await EmployeeService.getEmployeeByUserId(loginResponse.user.id);
        setUser({
          ...loginResponse.user,
          employee: {
            id: employeeData.id,
            full_name: employeeData.full_name,
            department: employeeData.department,
            position: employeeData.position,
            phone: employeeData.phone,
            employee_code: employeeData.employee_code,
          }
        });
      } catch (error) {
        console.error('Error loading employee data after login:', error);
        // Still set user even if employee data fails
        setUser(loginResponse.user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear user even if logout fails
      setUser(null);
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
