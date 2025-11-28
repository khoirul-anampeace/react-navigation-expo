import { RegisterFormData, RegisterResponse } from '../types/register';
import apiClient from './api';
import { encodeMultipleFaces } from './faceRecognitionService'; // ← TAMBAH INI

/**
 * Register user dengan form data + face photos
 * UPDATED: Sekarang encode faces dulu dengan Python API
 */
export async function registerWithPhotos(
  formData: RegisterFormData,
  photoUris: string[],
  onProgress?: (current: number, total: number) => void // ← TAMBAH INI
): Promise<RegisterResponse> {
  try {
    console.log('📤 Preparing registration data...');
    console.log('📸 Photos count:', photoUris.length);

    // ========================================
    // ✅ TAMBAHAN BARU: Encode faces dengan Python API
    // ========================================
    console.log('🔄 Step 1: Encoding faces with Python API...');
    
    const encodings = await encodeMultipleFaces(photoUris, onProgress);
    
    console.log(`✅ Face encoding complete: ${encodings.length} encodings`);

    // ========================================
    // BAGIAN INI TETAP SAMA SEPERTI SEBELUMNYA
    // ========================================
    
    // Create FormData
    const form = new FormData();

    // Append text fields
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('role', 'employee');
    form.append('fullName', formData.fullName);
    form.append('department', formData.department);
    form.append('position', formData.position);
    form.append('phone', formData.phone);
    form.append('hireDate', formData.hireDate);

    // ✅ PERUBAHAN: Kirim encodings yang sudah diproses (bukan array kosong)
    form.append('faceEncodings', JSON.stringify(encodings)); // ← PERUBAHAN DI SINI

    console.log('📤 Form data:', {
      email: formData.email,
      fullName: formData.fullName,
      department: formData.department,
      position: formData.position,
      phone: formData.phone,
      hireDate: formData.hireDate,
      faceEncodings: `${encodings.length} encodings`, // ← PERUBAHAN
    });

    // Append photos
    for (let i = 0; i < photoUris.length; i++) {
      const photo = {
        uri: photoUris[i],
        type: 'image/jpeg',
        name: `face_${i + 1}.jpg`,
      } as any;

      form.append('photos', photo);
      console.log(`📷 Added photo ${i + 1}:`, photoUris[i]);
    }

    console.log('🚀 Sending registration request to backend...');

    // Send request dengan apiClient yang sudah ada
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register-with-photos',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes
      }
    );

    console.log('✅ Registration successful!');
    console.log('📥 Response:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Registration failed:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(
        error.response.data?.message || 'Registration failed. Please try again.'
      );
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      console.error('Request error:', error.message);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
}

export default {
  registerWithPhotos,
};