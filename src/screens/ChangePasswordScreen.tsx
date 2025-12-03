import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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
import authService from '../services/authService';
import { useAppSelector } from '../store/hooks';
import { SettingsStackParamList } from '../types/navigation';

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'ChangePassword'
>;

interface Props {
  navigation: ChangePasswordScreenNavigationProp;
}

export default function ChangePasswordScreen({ navigation }: Props) {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validasi form
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Validasi old password
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Password lama harus diisi';
      valid = false;
    }

    // Validasi new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Password baru harus diisi';
      valid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password baru minimal 6 karakter';
      valid = false;
    }

    // Validasi confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
      valid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      valid = false;
    }

    // Cek apakah password baru sama dengan password lama
    if (formData.oldPassword === formData.newPassword && formData.newPassword) {
      newErrors.newPassword = 'Password baru harus berbeda dengan password lama';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: '❌ Validasi Gagal',
        text2: 'Periksa kembali password yang Anda masukkan',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return;
    }

    if (!user) {
      Toast.show({
        type: 'error',
        text1: '❌ Error',
        text2: 'User tidak ditemukan',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return;
    }

    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin mengubah password?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ubah',
          onPress: async () => {
            setIsLoading(true);

            try {
              await authService.updatePassword(
                user.id,
                formData.oldPassword,
                formData.newPassword
              );

              Toast.show({
                type: 'success',
                text1: '✅ Berhasil',
                text2: 'Password berhasil diubah',
                position: 'top',
                visibilityTime: 3000,
                topOffset: 60,
              });

              // Reset form
              setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              });

              // Navigate back setelah delay
              setTimeout(() => {
                navigation.goBack();
              }, 1500);
            } catch (error: any) {
              console.error('❌ Change password failed:', error);
              Toast.show({
                type: 'error',
                text1: '❌ Gagal',
                text2: error.message || 'Terjadi kesalahan saat mengubah password',
                position: 'top',
                visibilityTime: 4000,
                topOffset: 60,
              });
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    infoCard: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#FFF3CD',
      borderRadius: 12,
      padding: 15,
      marginHorizontal: 20,
      marginTop: 20,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: isDarkMode ? '#2C2C2E' : '#FFC107',
    },
    infoIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: isDarkMode ? colors.textSecondary : '#856404',
      lineHeight: 18,
    },
    section: {
      marginHorizontal: 20,
      marginTop: 20,
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
      paddingRight: 50,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputError: {
      borderColor: colors.danger,
    },
    eyeButton: {
      position: 'absolute',
      right: 15,
      top: 12,
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
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
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
            name="warning"
            size={20}
            color={isDarkMode ? colors.primary : '#856404'}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Pastikan Anda mengingat password baru. Password minimal 6 karakter dan
            harus berbeda dengan password lama.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Password Lama <Text style={styles.labelRequired}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.oldPassword ? styles.inputError : null,
                  ]}
                  value={formData.oldPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, oldPassword: text });
                    if (errors.oldPassword) {
                      setErrors({ ...errors, oldPassword: '' });
                    }
                  }}
                  placeholder="Masukkan password lama"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showOldPassword}
                  editable={!isLoading}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowOldPassword(!showOldPassword)}
                >
                  <Ionicons
                    name={showOldPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.oldPassword ? (
                <Text style={styles.errorText}>{errors.oldPassword}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Password Baru <Text style={styles.labelRequired}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.newPassword ? styles.inputError : null,
                  ]}
                  value={formData.newPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, newPassword: text });
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: '' });
                    }
                  }}
                  placeholder="Masukkan password baru"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showNewPassword}
                  editable={!isLoading}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword ? (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              ) : (
                <Text style={styles.helperText}>Minimal 6 karakter</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.inputGroupLast]}>
              <Text style={styles.label}>
                Konfirmasi Password Baru <Text style={styles.labelRequired}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmPassword ? styles.inputError : null,
                  ]}
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, confirmPassword: text });
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  placeholder="Masukkan ulang password baru"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
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
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Harus sama dengan password baru
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.submitButtonText}>Mengubah Password...</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Ubah Password</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}