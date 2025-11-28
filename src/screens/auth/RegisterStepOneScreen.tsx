import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import { DEPARTMENT_OPTIONS, getPositionsForDepartment } from '../../constants/employeeOptions';
import { useTheme } from '../../context/ThemeContext';
import { RegisterFormData } from '../../types/register';

interface Props {
  onNext: (data: RegisterFormData) => void;
  initialData?: Partial<RegisterFormData>;
}

export default function RegisterStepOneScreen({ onNext, initialData }: Props) {
  const { colors, isDarkMode } = useTheme();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: initialData?.email || '',
    password: initialData?.password || '',
    confirmPassword: initialData?.confirmPassword || '',
    fullName: initialData?.fullName || '',
    department: initialData?.department || '',
    position: initialData?.position || '',
    phone: initialData?.phone || '',
    hireDate: initialData?.hireDate || '',
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showPositionPicker, setShowPositionPicker] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Validasi form
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    let isValid = true;

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Format email tidak valid';
        isValid = false;
      }
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      isValid = false;
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      isValid = false;
    }

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap harus diisi';
      isValid = false;
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap minimal 3 karakter';
      isValid = false;
    }

    // Department
    if (!formData.department) {
      newErrors.department = 'Departemen harus dipilih';
      isValid = false;
    }

    // Position
    if (!formData.position) {
      newErrors.position = 'Posisi harus dipilih';
      isValid = false;
    }

    // Phone
    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10,13}$/;
      if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
        newErrors.phone = 'Format nomor telepon tidak valid (10-13 digit)';
        isValid = false;
      }
    }

    // Hire Date
    if (!formData.hireDate) {
      newErrors.hireDate = 'Tanggal bergabung harus diisi';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
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

    onNext(formData);
  };

  const availablePositions = getPositionsForDepartment(formData.department);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    header: {
      padding: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
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
    inputContainer: {
      position: 'relative',
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
    inputWithIcon: {
      paddingRight: 50,
    },
    inputError: {
      borderColor: colors.danger,
    },
    eyeButton: {
      position: 'absolute',
      right: 15,
      top: 12,
    },
    pickerButton: {
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickerButtonText: {
      fontSize: 15,
      color: colors.text,
    },
    pickerButtonPlaceholder: {
      fontSize: 15,
      color: colors.textSecondary,
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
    },
    nextButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    nextButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30,
      maxHeight: '60%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    modalCloseButton: {
      padding: 5,
    },
    modalOption: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalOptionLast: {
      borderBottomWidth: 0,
    },
    modalOptionText: {
      fontSize: 16,
      color: colors.text,
    },
    modalOptionSelected: {
      backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.1)' : '#E3F2FD',
    },
    modalOptionTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { flexGrow: 1, justifyContent: 'space-between' }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daftar Akun Baru</Text>
          <Text style={styles.subtitle}>
            Langkah 1 dari 2 • Isi data diri Anda
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email <Text style={styles.labelRequired}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  setErrors({ ...errors, email: '' });
                }}
                placeholder="contoh@email.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Password <Text style={styles.labelRequired}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithIcon,
                    errors.password && styles.inputError,
                  ]}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.inputGroupLast]}>
              <Text style={styles.label}>
                Konfirmasi Password <Text style={styles.labelRequired}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithIcon,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, confirmPassword: text });
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="Masukkan ulang password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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
                style={[styles.input, errors.fullName && styles.inputError]}
                value={formData.fullName}
                onChangeText={(text) => {
                  setFormData({ ...formData, fullName: text });
                  setErrors({ ...errors, fullName: '' });
                }}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.inputGroupLast]}>
              <Text style={styles.label}>Nomor Telepon</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });
                  setErrors({ ...errors, phone: '' });
                }}
                placeholder="08123456789"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : (
                <Text style={styles.helperText}>Format: 08123456789</Text>
              )}
            </View>
          </View>
        </View>

        {/* Work Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pekerjaan</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Departemen <Text style={styles.labelRequired}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  errors.department && styles.inputError,
                ]}
                onPress={() => setShowDepartmentPicker(true)}
              >
                <Text
                  style={
                    formData.department
                      ? styles.pickerButtonText
                      : styles.pickerButtonPlaceholder
                  }
                >
                  {formData.department || 'Pilih departemen'}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              {errors.department && (
                <Text style={styles.errorText}>{errors.department}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Posisi <Text style={styles.labelRequired}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.pickerButton, errors.position && styles.inputError]}
                onPress={() => {
                  if (!formData.department) {
                    Toast.show({
                      type: 'info',
                      text1: 'ℹ️ Info',
                      text2: 'Pilih departemen terlebih dahulu',
                      position: 'top',
                      visibilityTime: 2000,
                      topOffset: 60,
                    });
                    return;
                  }
                  setShowPositionPicker(true);
                }}
              >
                <Text
                  style={
                    formData.position
                      ? styles.pickerButtonText
                      : styles.pickerButtonPlaceholder
                  }
                >
                  {formData.position || 'Pilih posisi'}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              {errors.position && (
                <Text style={styles.errorText}>{errors.position}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.inputGroupLast]}>
              <Text style={styles.label}>
                Tanggal Bergabung <Text style={styles.labelRequired}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.pickerButton, errors.hireDate && styles.inputError]}
                onPress={() => setIsDatePickerVisible(true)}
              >
                <Text
                  style={
                    formData.hireDate
                      ? styles.pickerButtonText
                      : styles.pickerButtonPlaceholder
                  }
                >
                  {formData.hireDate || 'YYYY-MM-DD (contoh: 2025-01-15)'}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onConfirm={(date: Date) => {
                  const yyyy = date.getFullYear();
                  const mm = String(date.getMonth() + 1).padStart(2, '0');
                  const dd = String(date.getDate()).padStart(2, '0');
                  const formatted = `${yyyy}-${mm}-${dd}`;
                  setFormData({ ...formData, hireDate: formatted });
                  setErrors({ ...errors, hireDate: '' });
                  setIsDatePickerVisible(false);
                }}
                onCancel={() => setIsDatePickerVisible(false)}
              />
              {errors.hireDate ? (
                <Text style={styles.errorText}>{errors.hireDate}</Text>
              ) : (
                <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
              )}
            </View>
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Lanjut ke Foto Wajah</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Department Picker Modal */}
      <Modal
        visible={showDepartmentPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDepartmentPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDepartmentPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Departemen</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDepartmentPicker(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {DEPARTMENT_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    index === DEPARTMENT_OPTIONS.length - 1 &&
                      styles.modalOptionLast,
                    formData.department === option.value &&
                      styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setFormData({
                      ...formData,
                      department: option.value,
                      position: '',
                    });
                    setErrors({ ...errors, department: '' });
                    setShowDepartmentPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData.department === option.value &&
                        styles.modalOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Position Picker Modal */}
      <Modal
        visible={showPositionPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPositionPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPositionPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Posisi</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPositionPicker(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {availablePositions.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    index === availablePositions.length - 1 &&
                      styles.modalOptionLast,
                    formData.position === option.value &&
                      styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, position: option.value });
                    setErrors({ ...errors, position: '' });
                    setShowPositionPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData.position === option.value &&
                        styles.modalOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}