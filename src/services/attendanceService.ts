import apiClient from './api';

export interface AttendanceEntry {
  id: number;
  employee_id: number;
  check_in: string | null;
  check_out: string | null;
  date: string;
  status: string;
  location_lat: number | null;
  location_lng: number | null;
  photo_path: string | null;
  notes: string | null;
  created_at: string;
  employee_name: string;
  employee_code: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
}

export interface GetAttendanceResponse {
  success: boolean;
  message: string;
  attendance: AttendanceEntry[];
  count?: number;
}

class AttendanceService {
  async getByEmployeeId(employeeId: number): Promise<AttendanceEntry[]> {
    try {
      const response = await apiClient.get<GetAttendanceResponse>(`/attendance/employee/${employeeId}`);
      return response.data.attendance || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data absensi');
    }
  }
}

export default new AttendanceService();
