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

export interface GetEmployeeResponse {
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