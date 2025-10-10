import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import employeeService, { Employee } from '../../services/employeeService';

interface EmployeeState {
  currentEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  currentEmployee: null,
  isLoading: false,
  error: null,
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

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    // Clear employee data (misal saat logout)
    clearEmployeeData: (state) => {
      state.currentEmployee = null;
      state.error = null;
    },
    // Clear error
    clearEmployeeError: (state) => {
      state.error = null;
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
      });
  },
});

export const { clearEmployeeData, clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;