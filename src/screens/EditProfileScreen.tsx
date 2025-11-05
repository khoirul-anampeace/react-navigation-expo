import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUserData } from '../store/slices/authSlice';
import { clearUpdateSuccess, updateEmployee } from '../store/slices/employeeSlice';
import { SettingsStackParamList } from '../types/navigation';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'EditProfile'
>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

export default function EditProfileScreen({ navigation }: Props) {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentEmployee, isUpdating, updateSuccess } = useAppSelector(
    (state) => state.employee
  );

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    department: '',
    position: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    full_name: '',
    phone: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load data saat pertama kali
  useEffect(() => {
    if (currentEmployee && user) {
      setFormData({
        email: user.email || '',
        full_name: currentEmployee.full_name || '',
        department: currentEmployee.department || '',
        position: currentEmployee.position || '',
        phone: currentEmployee.phone || '',
      });
    }
  }, [currentEmployee, user]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess && !isSaving) {
      Toast.show({
        type: 'success',
        text1: '✅ Berhasil',
        text2: 'Profil berhasil diperbarui',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });

      const timer = setTimeout(() => {
        dispatch(clearUpdateSuccess());
        navigation.goBack();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, isSaving, dispatch, navigation]);

  // Validasi form
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = {
      email: '',
      full_name: '',
      phone: '',
    };

    // Validasi email
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Format email tidak valid';
        valid = false;
      }
    }

    // Validasi nama lengkap
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap harus diisi';
      valid = false;
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'Nama lengkap minimal 3 karakter';
      valid = false;
    }

    // Validasi phone (opsional, tapi kalau diisi harus valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10,13}$/;
      if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
        newErrors.phone = 'Format nomor telepon tidak valid (10-13 digit)';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: '❌ Validasi Gagal',
        text2: 'Periksa kembali data yang Anda masukkan',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return;
    }

    if (!currentEmployee || !user) {
      Toast.show({
        type: 'error',
        text1: '❌ Error',
        text2: 'Data tidak ditemukan',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return;
    }

    // Cek apakah ada perubahan
    const hasChanges =
      formData.email !== user.email ||
      formData.full_name !== currentEmployee.full_name ||
      formData.department !== currentEmployee.department ||
      formData.position !== currentEmployee.position ||
      formData.phone !== currentEmployee.phone;

    if (!hasChanges) {
      Toast.show({
        type: 'info',
        text1: 'ℹ️ Info',
        text2: 'Tidak ada perubahan data',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return;
    }

    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menyimpan perubahan?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Simpan',
          onPress: async () => {
            setIsSaving(true);

            try {
              // Update user (email) jika berubah
              if (formData.email !== user.email) {
                await dispatch(
                  updateUserData({
                    userId: user.id,
                    data: {
                      email: formData.email.trim(),
                      role: user.role || 'employee', // Kirim role juga
                    },
                  })
                ).unwrap();
              }

              // Update employee data dengan camelCase
              const updateData = {
                fullName: formData.full_name.trim() || currentEmployee.full_name,
                department: formData.department.trim() || currentEmployee.department || '',
                position: formData.position.trim() || currentEmployee.position || '',
                phone: formData.phone.trim() || currentEmployee.phone || '',
                hireDate: currentEmployee.hire_date,
              };

              console.log('🚀 Sending update data:', updateData);
              console.log('🆔 Employee ID:', currentEmployee.id);

              await dispatch(
                updateEmployee({
                  employeeId: currentEmployee.id,
                  data: updateData,
                })
              ).unwrap();

              console.log('✅ Update success');
            } catch (error: any) {
              console.error('❌ Update failed:', error);
              Toast.show({
                type: 'error',
                text1: '❌ Gagal',
                text2: error || 'Terjadi kesalahan saat menyimpan data',
                position: 'top',
                visibilityTime: 4000,
                topOffset: 60,
              });
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  // Handle cancel
  const handleCancel = () => {
    const hasChanges =
      formData.email !== (user?.email || '') ||
      formData.full_name !== (currentEmployee?.full_name || '') ||
      formData.department !== (currentEmployee?.department || '') ||
      formData.position !== (currentEmployee?.position || '') ||
      formData.phone !== (currentEmployee?.phone || '');

    if (hasChanges) {
      Alert.alert(
        'Konfirmasi',
        'Perubahan belum disimpan. Yakin ingin keluar?',
        [
          {
            text: 'Tidak',
            style: 'cancel',
          },
          {
            text: 'Ya',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    section: {
      marginHorizontal: 20,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
      marginLeft: 5,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 15,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputGroupLast: {
      marginBottom: 0,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    labelRequired: {
      color: colors.danger,
    },
    input: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputError: {
      borderColor: colors.danger,
    },
    errorText: {
      fontSize: 12,
      color: colors.danger,
      marginTop: 5,
      marginLeft: 5,
    },
    helperText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 5,
      marginLeft: 5,
    },
    buttonContainer: {
      marginHorizontal: 20,
      marginTop: 30,
      gap: 12,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    infoCard: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#E3F2FD',
      borderRadius: 12,
      padding: 15,
      marginHorizontal: 20,
      marginTop: 20,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: isDarkMode ? '#2C2C2E' : '#BBDEFB',
    },
    infoIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle"
            size={20}
            color={colors.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Anda dapat mengubah informasi profil Anda di sini. Pastikan data yang
            dimasukkan sudah benar sebelum menyimpan.
          </Text>
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email <Text style={styles.labelRequired}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                placeholder="Masukkan email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSaving}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : (
                <Text style={styles.helperText}>Email untuk login</Text>
              )}
            </View>
          </View>
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nama Lengkap <Text style={styles.labelRequired}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.full_name ? styles.inputError : null]}
                value={formData.full_name}
                onChangeText={(text) => {
                  setFormData({ ...formData, full_name: text });
                  if (errors.full_name) {
                    setErrors({ ...errors, full_name: '' });
                  }
                }}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={colors.textSecondary}
                editable={!isSaving}
              />
              {errors.full_name ? (
                <Text style={styles.errorText}>{errors.full_name}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor Telepon</Text>
              <TextInput
                style={[styles.input, errors.phone ? styles.inputError : null]}
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });
                  if (errors.phone) {
                    setErrors({ ...errors, phone: '' });
                  }
                }}
                placeholder="Masukkan nomor telepon"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                editable={!isSaving}
              />
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : (
                <Text style={styles.helperText}>Format: 08123456789</Text>
              )}
            </View>
          </View>
        </View>

        {/* Work Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pekerjaan</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Departemen</Text>
              <TextInput
                style={styles.input}
                value={formData.department}
                onChangeText={(text) =>
                  setFormData({ ...formData, department: text })
                }
                placeholder="Masukkan departemen"
                placeholderTextColor={colors.textSecondary}
                editable={!isSaving}
              />
            </View>

            <View style={[styles.inputGroup, styles.inputGroupLast]}>
              <Text style={styles.label}>Posisi</Text>
              <TextInput
                style={styles.input}
                value={formData.position}
                onChangeText={(text) =>
                  setFormData({ ...formData, position: text })
                }
                placeholder="Masukkan posisi"
                placeholderTextColor={colors.textSecondary}
                editable={!isSaving}
              />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.saveButtonText}>Menyimpan...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}