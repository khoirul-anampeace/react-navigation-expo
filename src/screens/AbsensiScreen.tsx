import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import attendanceService, { AttendanceEntry } from '../services/attendanceService';
import employeeService from '../services/employeeService';
import { useAppSelector } from '../store/hooks';

export default function AbsensiScreen() {
  const { colors } = useTheme();
  const authUser = useAppSelector((s) => s.auth.user);

  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const [refreshing, setRefreshing] = useState(false);

  const loadAttendance = useCallback(async () => {
    if (!authUser?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      // First get employee record by user id to obtain employee id
      const employee = await employeeService.getEmployeeByUserId(authUser.id);
      const items = await attendanceService.getByEmployeeId(employee.id);
      setAttendance(items);
    } catch (err: any) {
      console.error('Load attendance error', err);
      setError(err.message || 'Gagal memuat absensi');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAttendance();
  }, [loadAttendance]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'late':
        return 'Terlambat';
      case 'absent':
        return 'Tidak Hadir';
      case 'on_leave':
      case 'leave':
        return 'Cuti';
      case 'sick':
        return 'Sakit';
      default:
        // Capitalize first letter
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : status;
    }
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
      <View style={styles.historySection}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : error ? (
          <Text style={{ color: colors.danger }}>{error}</Text>
        ) : attendance.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>Belum ada data absensi</Text>
        ) : (
          attendance.map((item) => {
            const dateObj = new Date(item.date);
            const dateLabel = dateObj.toLocaleDateString('id-ID', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            const formatTime = (iso?: string | null) => {
              if (!iso) return '-';
              try {
                return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
              } catch {
                return iso;
              }
            };

            const statusColor = item.status === 'present' ? '#4CAF50' : item.status === 'late' ? '#FF9800' : '#F44336';

            return (
              <View key={item.id} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyDate}>{dateLabel}</Text>
                  <Text style={styles.historyTime}>Masuk: {formatTime(item.check_in_time || item.check_in)} | Pulang: {formatTime(item.check_out_time || item.check_out)}</Text>
                </View>
                <Text style={[styles.historyStatus, { color: statusColor }]}>{getStatusLabel(item.status)}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}