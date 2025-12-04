import apiClient from './api';

export interface WorkSchedule {
  id: number;
  employee_id: number;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ...
  start_time: string; // e.g. "08:00:00"
  end_time: string;   // e.g. "17:00:00"
  is_active: number; // 1 or 0
  employee_name?: string;
  employee_code?: string;
}

export interface GetWorkSchedulesResponse {
  success: boolean;
  message: string;
  schedules: WorkSchedule[];
}

class WorkScheduleService {
  async getByEmployeeId(employeeId: number): Promise<WorkSchedule[]> {
    try {
      const res = await apiClient.get<GetWorkSchedulesResponse>(`/work-schedules/employee/${employeeId}`);
      return res.data.schedules || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil jadwal kerja');
    }
  }
}

export default new WorkScheduleService();
