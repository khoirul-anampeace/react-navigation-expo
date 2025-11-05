import apiClient from './api';

export interface Employee {
  id: number;
  user_id: number;
  employee_code: string;
  full_name: string;
  department: string;
  position: string;
  phone: string;
  hire_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateEmployeeData {
  fullName?: string;      // camelCase
  department?: string;
  position?: string;
  phone?: string;
  hireDate?: string;      // camelCase
}

export interface GetEmployeeResponse {
  success: boolean;
  message: string;
  employee: Employee;
}

export interface UpdateEmployeeResponse {
  success: boolean;
  message: string;
  employee: Employee;
}

class EmployeeService {
  // Get employee data by user ID
  async getEmployeeByUserId(userId: number): Promise<Employee> {
    try {
      const response = await apiClient.get<GetEmployeeResponse>(
        `/employees/user/${userId}`
      );
      return response.data.employee;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data employee'
      );
    }
  }

  // Update employee data
  async updateEmployee(employeeId: number, data: UpdateEmployeeData): Promise<Employee> {
    try {
      // Filter out empty/undefined values jika backend tidak menerima empty string
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      console.log('📤 Sending to backend:', cleanData);

      const response = await apiClient.put<UpdateEmployeeResponse>(
        `/employees/${employeeId}`,
        cleanData
      );
      return response.data.employee;
    } catch (error: any) {
      console.error('❌ Backend error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal mengupdate data employee'
      );
    }
  }

  // Get all employees (untuk keperluan lain kalau perlu)
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await apiClient.get<{ success: boolean; employees: Employee[] }>(
        '/employees'
      );
      return response.data.employees;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data employees'
      );
    }
  }
}

export default new EmployeeService();