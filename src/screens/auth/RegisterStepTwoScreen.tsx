import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../context/ThemeContext';
import { registerWithPhotos } from '../../services/registerService';
import { FacePhotoData, RegisterFormData } from '../../types/register';
// Setelah state yang sudah ada, TAMBAHKAN:
const [isEncoding, setIsEncoding] = useState(false);
const [encodingProgress, setEncodingProgress] = useState({ current: 0, total: 0 });

interface Props {
  formData: RegisterFormData;
  onSuccess: () => void;
  onBack: () => void;
}

const TOTAL_PHOTOS = 5;

export default function RegisterStepTwoScreen({ formData, onSuccess, onBack }: Props) {
  const { colors, isDarkMode } = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [photos, setPhotos] = useState<FacePhotoData[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [isEncoding, setIsEncoding] = useState(false);
  const [encodingProgress, setEncodingProgress] = useState({ current: 0, total: 0 });

  const currentPhotoNumber = photos.length + 1;
  const isComplete = photos.length === TOTAL_PHOTOS;

  // Request camera permission
  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Ionicons name="camera-outline" size={80} color={colors.textSecondary} />
        <Text style={[styles.permissionTitle, { color: colors.text }]}>
          Izin Kamera Diperlukan
        </Text>
        <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
          Aplikasi memerlukan akses kamera untuk mengambil foto wajah Anda
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Izinkan Akses Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Capture photo
  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        const newPhoto: FacePhotoData = {
          uri: photo.uri,
          timestamp: Date.now(),
        };

        setPhotos([...photos, newPhoto]);

        Toast.show({
          type: 'success',
          text1: '✅ Foto Berhasil',
          text2: `Foto ${currentPhotoNumber} dari ${TOTAL_PHOTOS} tersimpan`,
          position: 'top',
          visibilityTime: 2000,
          topOffset: 60,
        });
      }
    } catch (error: any) {
      console.error('Capture error:', error);
      Toast.show({
        type: 'error',
        text1: '❌ Gagal Mengambil Foto',
        text2: 'Silakan coba lagi',
        position: 'top',
        visibilityTime: 2000,
        topOffset: 60,
      });
    } finally {
      setIsCapturing(false);
    }
  };

  // Delete photo
  const deletePhoto = (index: number) => {
    Alert.alert(
      'Hapus Foto',
      `Hapus foto ${index + 1}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index);
            setPhotos(newPhotos);
          },
        },
      ]
    );
  };

  // Retake all
  const retakeAll = () => {
    Alert.alert(
      'Ambil Ulang Semua Foto',
      'Apakah Anda yakin ingin menghapus semua foto dan mengambil ulang?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Ambil Ulang',
          style: 'destructive',
          onPress: () => setPhotos([]),
        },
      ]
    );
  };

  // Submit registration
  const handleSubmit = async () => {
  if (photos.length < TOTAL_PHOTOS) {
    Toast.show({
      type: 'error',
      text1: '❌ Foto Belum Lengkap',
      text2: `Anda perlu ${TOTAL_PHOTOS - photos.length} foto lagi`,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
    return;
  }

  Alert.alert(
    'Konfirmasi Pendaftaran',
    'Apakah data yang Anda masukkan sudah benar?',
    [
      { text: 'Cek Lagi', style: 'cancel' },
      {
        text: 'Ya, Daftar',
        onPress: async () => {
          setIsUploading(true);
          setIsEncoding(true); // ← TAMBAH

          try {
            const photoUris = photos.map((p) => p.uri);

            console.log('🚀 Starting registration...');
            
            // ✅ PERUBAHAN: Tambah progress callback
            await registerWithPhotos(
              formData, 
              photoUris,
              (current, total) => {
                console.log(`Progress: ${current}/${total}`);
                setEncodingProgress({ current, total }); // ← TAMBAH
              }
            );

            console.log('✅ Registration successful!');

            setIsEncoding(false); // ← TAMBAH

            Toast.show({
              type: 'success',
              text1: '✅ Pendaftaran Berhasil!',
              text2: 'Akun Anda telah berhasil dibuat',
              position: 'top',
              visibilityTime: 3000,
              topOffset: 60,
            });

            setTimeout(() => {
              onSuccess();
            }, 1500);
          } catch (error: any) {
            console.error('❌ Registration failed:', error);
            
            setIsEncoding(false); // ← TAMBAH
            
            Alert.alert(
              'Pendaftaran Gagal',
              error.message || 'Terjadi kesalahan. Silakan coba lagi.',
              [{ text: 'OK' }]
            );
          } finally {
            setIsUploading(false);
          }
        },
      },
    ]
  );
};

  if (isComplete) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
            <Text style={[styles.backButtonText, { color: colors.primary }]}>Kembali</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Foto Wajah Lengkap!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {TOTAL_PHOTOS} foto sudah diambil. Lanjutkan pendaftaran?
          </Text>
        </View>

        <View style={{ flex: 1, padding: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
            }}
          >
            {photos.map((photo, index) => (
              <View key={index} style={styles.thumbnail}>
                <Image source={{ uri: photo.uri }} style={styles.thumbnailImage} />
                <TouchableOpacity
                  style={[styles.thumbnailDelete, { backgroundColor: colors.danger }]}
                  onPress={() => deletePhoto(index)}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={retakeAll}
          >
            <Ionicons name="camera-reverse" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Ambil Ulang</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.submitButton,
              { backgroundColor: colors.primary, borderColor: colors.primary },
              isUploading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text style={[styles.actionButtonText, styles.submitButtonText]}>
                  Mendaftar...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={[styles.actionButtonText, styles.submitButtonText]}>
                  Daftar Sekarang
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {isEncoding && (
  <View style={styles.encodingOverlay}>
    <View style={[styles.encodingCard, { backgroundColor: colors.card }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.encodingTitle, { color: colors.text }]}>
        Memproses Foto Wajah
      </Text>
      <Text style={[styles.encodingText, { color: colors.textSecondary }]}>
        Foto {encodingProgress.current} dari {encodingProgress.total}
      </Text>
      <Text style={[styles.encodingSubtext, { color: colors.textSecondary }]}>
        Mohon tunggu 30-60 detik...
      </Text>
    </View>
  </View>
)}

      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Kembali</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Ambil Foto Wajah</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Langkah 2 dari 2 • Foto {currentPhotoNumber} dari {TOTAL_PHOTOS}
        </Text>
      </View>

      <View style={[styles.instructionCard, { 
        backgroundColor: isDarkMode ? '#1C1C1E' : '#FFF3CD',
        borderColor: isDarkMode ? '#2C2C2E' : '#FFC107',
      }]}>
        <Text style={[styles.instructionTitle, { 
          color: isDarkMode ? colors.text : '#856404' 
        }]}>
          <Ionicons name="information-circle" size={16} /> Tips Foto yang Baik:
        </Text>
        <Text style={[styles.instructionText, { 
          color: isDarkMode ? colors.textSecondary : '#856404' 
        }]}>
          • Pastikan wajah terlihat jelas{'\n'}
          • Gunakan pencahayaan yang cukup{'\n'}
          • Hadapkan wajah ke kamera{'\n'}
          • Ambil dari berbagai sudut (depan, kiri, kanan){'\n'}
          • Hindari menggunakan kacamata atau masker
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front">
          <View style={styles.cameraOverlay}>
            <View style={styles.topOverlay}>
              <View style={styles.photoCounter}>
                <Text style={styles.photoCounterText}>
                  {currentPhotoNumber} / {TOTAL_PHOTOS}
                </Text>
              </View>
            </View>

            <View style={styles.bottomOverlay}>
              <TouchableOpacity
                style={[
                  styles.captureButton,
                  { borderColor: colors.primary },
                  isCapturing && styles.captureButtonDisabled,
                ]}
                onPress={capturePhoto}
                disabled={isCapturing}
              >
                <View style={[styles.captureButtonInner, { backgroundColor: colors.primary }]} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>

      {photos.length > 0 && (
        <View style={[styles.thumbnailContainer, { 
          backgroundColor: colors.card, 
          borderTopColor: colors.border 
        }]}>
          <View style={styles.thumbnailScroll}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.thumbnail}>
                <Image source={{ uri: photo.uri }} style={styles.thumbnailImage} />
                <TouchableOpacity
                  style={[styles.thumbnailDelete, { backgroundColor: colors.danger }]}
                  onPress={() => deletePhoto(index)}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {[...Array(TOTAL_PHOTOS - photos.length)].map((_, index) => (
              <View key={`placeholder-${index}`} style={[styles.thumbnailPlaceholder, {
                backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
                borderColor: colors.border,
              }]}>
                <Ionicons name="camera-outline" size={20} color={colors.textSecondary} />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ✅ PINDAHKAN STYLESHEET KE LUAR COMPONENT
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  permissionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
  },
  instructionCard: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topOverlay: {
    padding: 20,
    alignItems: 'center',
  },
  photoCounter: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  photoCounterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomOverlay: {
    padding: 20,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
  },
  thumbnailScroll: {
    flexDirection: 'row',
    gap: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  thumbnailDelete: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  submitButton: {
    // Style akan di-override di JSX
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButtonText: {
    color: 'white',
  },
  encodingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
encodingCard: {
  padding: 30,
  borderRadius: 20,
  alignItems: 'center',
  width: '90%',
  maxWidth: 350,
},
encodingTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 20,
  marginBottom: 10,
},
encodingText: {
  fontSize: 16,
  marginBottom: 10,
},
encodingSubtext: {
  fontSize: 13,
  textAlign: 'center',
},
});