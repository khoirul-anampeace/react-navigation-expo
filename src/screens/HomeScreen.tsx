import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import attendanceService, { AttendanceEntry } from '../services/attendanceService';
import workScheduleService, { WorkSchedule } from '../services/workScheduleService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEmployeeByUserId } from '../store/slices/employeeSlice';
import { HomeStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentEmployee } = useAppSelector((state) => state.employee);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [showSchedulesModal, setShowSchedulesModal] = useState(false);

  // Fetch employee data saat component mount
  useEffect(() => {
    if (user?.id && !currentEmployee) {
      dispatch(fetchEmployeeByUserId(user.id));
    }
  }, [user?.id, currentEmployee, dispatch]);

  // Load attendance when we have employee
  useEffect(() => {
    const load = async () => {
      if (!currentEmployee?.id) return;
      setLoadingAttendance(true);
      try {
        const items = await attendanceService.getByEmployeeId(currentEmployee.id);
        setAttendance(items || []);
      } catch (e) {
        console.error('Error loading attendance for home', e);
        setAttendance([]);
      } finally {
        setLoadingAttendance(false);
      }
    };

    load();
  }, [currentEmployee]);

  // Load schedules
  useEffect(() => {
    const loadSchedules = async () => {
      if (!currentEmployee?.id) return;
      setLoadingSchedules(true);
      try {
        const items = await workScheduleService.getByEmployeeId(currentEmployee.id);
        setSchedules(items || []);
      } catch (e) {
        console.error('Error loading schedules', e);
        setSchedules([]);
      } finally {
        setLoadingSchedules(false);
      }
    };

    loadSchedules();
  }, [currentEmployee]);

  // Helpers
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
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : status;
    }
  };

  const monthStats = useMemo(() => {
    if (!attendance || attendance.length === 0) return { daysPresent: 0, avgCheckIn: null };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthItems = attendance.filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const daysPresent = monthItems.length;

    // Average check-in time (use check_in_time or check_in)
    const timesInMinutes: number[] = monthItems
      .map((a) => a.check_in_time || a.check_in)
      .filter(Boolean)
      .map((iso) => {
        try {
          const t = new Date(iso as string);
          return t.getHours() * 60 + t.getMinutes();
        } catch {
          return NaN;
        }
      })
      .filter((v) => !isNaN(v));

    let avgCheckIn: string | null = null;
    if (timesInMinutes.length > 0) {
      const avg = Math.round(timesInMinutes.reduce((s, v) => s + v, 0) / timesInMinutes.length);
      const hh = String(Math.floor(avg / 60)).padStart(2, '0');
      const mm = String(avg % 60).padStart(2, '0');
      avgCheckIn = `${hh}:${mm}`;
    }

    return { daysPresent, avgCheckIn };
  }, [attendance]);

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 10,
    },
    greeting: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 5,
    },
    userName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    date: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      padding: 20,
      gap: 15,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statCardPrimary: {
      backgroundColor: isDarkMode ? '#1E3A5F' : '#E3F2FD',
      borderColor: colors.primary,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    section: {
      padding: 20,
      paddingTop: 10,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    seeAll: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 15,
    },
    menuItem: {
      width: '47%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.2)' : '#E3F2FD',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    menuLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    activityCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    activityIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : '#E8F5E9',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    activityTime: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    activityStatus: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : '#E8F5E9',
    },
    activityStatusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#4CAF50',
    },
    scheduleContainer: {
      padding: 20,
      paddingTop: 0,
    },
    scheduleCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    scheduleDay: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    scheduleTime: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },
    modalClose: {
      marginTop: 12,
      alignSelf: 'flex-end',
    },
  });

  // Schedule helpers
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const mapDayName = (d: number) => {
    return dayNames[d] ?? String(d);
  };

  const formatTimeSimple = (t?: string) => {
    if (!t) return '';
    // Expecting 'HH:MM:SS' or similar
    return t.slice(0, 5);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.userName}>
          {currentEmployee?.full_name || user?.email?.split('@')[0] || 'User'}
        </Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <View style={styles.statIcon}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          </View>
          {loadingAttendance ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.statValue}>{monthStats.daysPresent}</Text>
          )}
          <Text style={styles.statLabel}>Hari Hadir (Bulan Ini)</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
          </View>
          {loadingAttendance ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.statValue}>{monthStats.avgCheckIn ?? '-'}</Text>
          )}
          <Text style={styles.statLabel}>Rata-rata Masuk</Text>
        </View>
      </View>

      <View style={styles.scheduleContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Jadwal Kerja</Text>
          <TouchableOpacity onPress={() => setShowSchedulesModal(true)}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {loadingSchedules ? (
          <ActivityIndicator color={colors.primary} />
        ) : schedules.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>Belum ada jadwal</Text>
        ) : (
          // show up to 3 schedules summary
          schedules.slice(0, 3).map((s) => (
            <TouchableOpacity key={s.id} style={styles.scheduleCard} onPress={() => setShowSchedulesModal(true)}>
              <View>
                <Text style={styles.scheduleDay}>{mapDayName(s.day_of_week)}</Text>
                <Text style={styles.scheduleTime}>{formatTimeSimple(s.start_time)} - {formatTimeSimple(s.end_time)}</Text>
              </View>
              <Text style={[styles.scheduleTime, { fontWeight: '700' }]}>{s.is_active ? 'Berlaku' : 'Tidak Berlaku'}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
      {/* Schedules modal */}
      <Modal
        visible={showSchedulesModal}
        animationType="slide"
        onRequestClose={() => setShowSchedulesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Text style={styles.modalTitle}>Jadwal Kerja</Text>
          <ScrollView>
            {loadingSchedules ? (
              <ActivityIndicator color={colors.primary} />
            ) : schedules.length === 0 ? (
              <Text style={{ color: colors.textSecondary }}>Belum ada jadwal</Text>
            ) : (
              schedules
                .slice()
                .sort((a, b) => a.day_of_week - b.day_of_week)
                .map((s) => (
                  <View key={s.id} style={[styles.scheduleCard, { marginBottom: 8 }]}>
                    <View>
                      <Text style={styles.scheduleDay}>{mapDayName(s.day_of_week)}</Text>
                      <Text style={styles.scheduleTime}>{formatTimeSimple(s.start_time)} - {formatTimeSimple(s.end_time)}</Text>
                    </View>
                    <Text style={[styles.scheduleTime, { fontWeight: '700' }]}>{s.is_active ? 'Berlaku' : 'Tidak Berlaku'}</Text>
                  </View>
                ))
            )}
          </ScrollView>

          <TouchableOpacity style={styles.modalClose} onPress={() => setShowSchedulesModal(false)}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {loadingAttendance ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          (() => {
            type Act = { id: string; type: 'in' | 'out'; timestamp: string; label: string; statusLabel: string; raw: AttendanceEntry };
            const acts: Act[] = [];

            attendance.forEach((item) => {
              if (item.check_in_time || item.check_in) {
                acts.push({
                  id: `${item.id}-in`,
                  type: 'in',
                  timestamp: (item.check_in_time || item.check_in) as string,
                  label: 'Absen Masuk',
                  statusLabel: getStatusLabel(item.status || 'present'),
                  raw: item,
                });
              }
              if (item.check_out_time || item.check_out) {
                acts.push({
                  id: `${item.id}-out`,
                  type: 'out',
                  timestamp: (item.check_out_time || item.check_out) as string,
                  label: 'Absen Pulang',
                  statusLabel: 'Pulang',
                  raw: item,
                });
              }
            });

            acts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            return acts.slice(0, 4).map((act) => {
              const timeLabel = (() => {
                try {
                  const d = new Date(act.timestamp);
                  const now = new Date();
                  const isToday = d.toDateString() === now.toDateString();
                  const dayLabel = isToday ? 'Hari ini' : d.toLocaleDateString('id-ID', { weekday: 'long' });
                  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  return `${dayLabel}, ${time} WIB`;
                } catch {
                  return act.timestamp;
                }
              })();

              const iconName = act.type === 'in' ? 'log-in-outline' : 'log-out-outline';
              const iconColor = act.type === 'in' ? '#4CAF50' : '#2196F3';

              return (
                <TouchableOpacity
                  key={act.id}
                  style={styles.activityCard}
                  onPress={() => {
                    const r = act.raw;
                    Alert.alert(
                      `${act.label} - ${act.statusLabel}`,
                      `Tanggal: ${new Date(r.date).toLocaleDateString('id-ID')}\nMasuk: ${r.check_in_time || r.check_in || '-'}\nPulang: ${r.check_out_time || r.check_out || '-'}\nCatatan: ${r.notes || '-'}`,
                      [{ text: 'OK' }]
                    );
                  }}
                >
                  <View style={styles.activityIconContainer}>
                    <Ionicons name={iconName as any} size={24} color={iconColor} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{act.label}</Text>
                    <Text style={styles.activityTime}>{timeLabel}</Text>
                  </View>
                  <View style={styles.activityStatus}>
                    <Text style={[styles.activityStatusText, { color: iconColor }]}>{act.statusLabel}</Text>
                  </View>
                </TouchableOpacity>
              );
            });
          })()
        )}

        {/* <View style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="document-outline" size={24} color="#4CAF50" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Pengajuan Izin</Text>
            <Text style={styles.activityTime}>2 hari lalu</Text>
          </View>
          <View style={styles.activityStatus}>
            <Text style={styles.activityStatusText}>Disetujui</Text>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}