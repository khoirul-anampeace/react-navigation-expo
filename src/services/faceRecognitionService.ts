// src/services/faceRecognitionService.ts

// Face Recognition Service - Python API Integration

const PYTHON_API_URL = 'http://10.10.180.241:8000'; // Sesuaikan dengan IP Anda

/**
 * Encode single face from photo
 */
export async function encodeFace(photoUri: string): Promise<number[]> {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'face.jpg',
    } as any);

    // ✅ FIX: Manual timeout dengan AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

    const response = await fetch(`${PYTHON_API_URL}/encode-face`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: controller.signal, // ← Gunakan controller.signal
    });

    clearTimeout(timeoutId); // ← Clear timeout jika berhasil

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to encode face');
    }

    const result = await response.json();

    if (!result.encoding) {
      throw new Error('No face detected in image');
    }

    return result.encoding;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Face encoding timeout. Please try again.');
    }
    throw new Error(error.message || 'Failed to encode face');
  }
}

/**
 * Encode multiple faces
 */
export async function encodeMultipleFaces(
  photoUris: string[],
  onProgress?: (current: number, total: number) => void
): Promise<number[][]> {
  const encodings: number[][] = [];

  for (let i = 0; i < photoUris.length; i++) {
    console.log(`📸 Encoding photo ${i + 1}/${photoUris.length}...`);

    if (onProgress) {
      onProgress(i + 1, photoUris.length);
    }

    const encoding = await encodeFace(photoUris[i]);
    encodings.push(encoding);

    console.log(`✅ Photo ${i + 1} encoded`);
  }

  return encodings;
}

export default {
  encodeFace,
  encodeMultipleFaces,
};