import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AbsensiScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingBlock: 0,
      paddingInline: 20,
    },
    header: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    dateText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statusCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    statusTitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    statusValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
    },
    buttonContainer: {
      gap: 15,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonSecondary: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextSecondary: {
      color: colors.primary,
    },
    historySection: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
    },
    historyItem: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    historyDate: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    historyTime: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    historyStatus: {
      fontSize: 12,
      color: '#4CAF50',
      fontWeight: '600',
    },
  });

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Absensi Hari Ini</Text>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Status Absensi</Text>
        <Text style={styles.statusValue}>Belum Absen</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Absen Masuk</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Absen Pulang
          </Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.historySection}>
        {/* <Text style={styles.sectionTitle}>Riwayat Absensi</Text> */}
        
        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyDate}>Senin, 28 Oktober 2024</Text>
            <Text style={styles.historyTime}>Masuk: 08:00 | Pulang: 17:00</Text>
          </View>
          <Text style={styles.historyStatus}>Hadir</Text>
        </View>

        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyDate}>Jumat, 25 Oktober 2024</Text>
            <Text style={styles.historyTime}>Masuk: 08:15 | Pulang: 17:05</Text>
          </View>
          <Text style={styles.historyStatus}>Hadir</Text>
        </View>

        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyDate}>Kamis, 24 Oktober 2024</Text>
            <Text style={styles.historyTime}>Masuk: 08:05 | Pulang: 17:02</Text>
          </View>
          <Text style={styles.historyStatus}>Hadir</Text>
        </View>
      </View>
    </View>
  );
}