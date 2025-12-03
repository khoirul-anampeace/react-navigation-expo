import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
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

  // Fetch employee data saat component mount
  useEffect(() => {
    if (user?.id && !currentEmployee) {
      dispatch(fetchEmployeeByUserId(user.id));
    }
  }, [user?.id, currentEmployee, dispatch]);

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
      marginBottom: 12,
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
  });

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
          <Text style={styles.statValue}>22</Text>
          <Text style={styles.statLabel}>Hari Hadir</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>08:15</Text>
          <Text style={styles.statLabel}>Rata-rata Masuk</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="log-in-outline" size={24} color="#4CAF50" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Absen Masuk</Text>
            <Text style={styles.activityTime}>Hari ini, 08:05 WIB</Text>
          </View>
          <View style={styles.activityStatus}>
            <Text style={styles.activityStatusText}>Tepat Waktu</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="log-out-outline" size={24} color="#4CAF50" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Absen Pulang</Text>
            <Text style={styles.activityTime}>Kemarin, 17:02 WIB</Text>
          </View>
          <View style={styles.activityStatus}>
            <Text style={styles.activityStatusText}>Selesai</Text>
          </View>
        </View>

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