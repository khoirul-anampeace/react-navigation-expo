import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  onGoToLogin: () => void;
}

export default function RegisterSuccessScreen({ onGoToLogin }: Props) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 15,
    },
    message: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: 40,
      paddingVertical: 15,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    infoBox: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      marginTop: 30,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
      </View>

      <Text style={styles.title}>Pendaftaran Berhasil! 🎉</Text>

      <Text style={styles.message}>
        Akun Anda telah berhasil dibuat dengan sistem Face Recognition.{'\n\n'}
        Sekarang Anda dapat login menggunakan email dan password yang telah didaftarkan.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onGoToLogin}>
        <Text style={styles.buttonText}>Login Sekarang</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Untuk keamanan akun Anda, pastikan tidak membagikan password kepada siapapun.
        </Text>
      </View>
    </View>
  );
}