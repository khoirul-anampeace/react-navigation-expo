// Register Form Data (Step 1)
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  department: string;
  position: string;
  phone: string;
  hireDate: string;
}

// Face Photo Data (Step 2)
export interface FacePhotoData {
  uri: string;
  timestamp: number;
}

// API Response
export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      email: string;
      role: string;
    };
    employee: {
      id: number;
      employeeCode: string;
      fullName: string;
      department: string;
      position: string;
      phone: string;
      hireDate: string;
    };
    faceEncoding: {
      photoCount: number;
      photos: string[];
    };
  };
}