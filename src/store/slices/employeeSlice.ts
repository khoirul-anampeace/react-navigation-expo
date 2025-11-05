import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import employeeService, { Employee, UpdateEmployeeData } from '../../services/employeeService';

interface EmployeeState {
  currentEmployee: Employee | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  updateSuccess: boolean;
}

const initialState: EmployeeState = {
  currentEmployee: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  updateSuccess: false,
};

// Async thunk untuk fetch employee data by user ID
export const fetchEmployeeByUserId = createAsyncThunk(
  'employee/fetchByUserId',
  async (userId: number, { rejectWithValue }) => {
    try {
      const employee = await employeeService.getEmployeeByUserId(userId);
      return employee;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Gagal mengambil data employee');
    }
  }
);

// Async thunk untuk update employee data
export const updateEmployee = createAsyncThunk(
  'employee/update',
  async (
    { employeeId, data }: { employeeId: number; data: UpdateEmployeeData },
    { rejectWithValue }
  ) => {
    try {
      const employee = await employeeService.updateEmployee(employeeId, data);
      return employee;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Gagal mengupdate data employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    // Clear employee data (misal saat logout)
    clearEmployeeData: (state) => {
      state.currentEmployee = null;
      state.error = null;
      state.updateSuccess = false;
    },
    // Clear error
    clearEmployeeError: (state) => {
      state.error = null;
    },
    // Clear update success flag
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employee by user ID
      .addCase(fetchEmployeeByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEmployee = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployeeByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentEmployee = action.payload;
        state.error = null;
        state.updateSuccess = true;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { clearEmployeeData, clearEmployeeError, clearUpdateSuccess } = employeeSlice.actions;
export default employeeSlice.reducer;