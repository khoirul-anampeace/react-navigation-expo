import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchEmployeeByUserId } from '../store/slices/employeeSlice';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentEmployee, isLoading, error } = useAppSelector((state) => state.employee);
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch employee data saat component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchEmployeeByUserId(user.id));
    }
  }, [user?.id, dispatch]);

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (user?.id) {
      dispatch(fetchEmployeeByUserId(user.id)).finally(() => {
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  }, [user?.id, dispatch]);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ]
    );
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format phone number
  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    // Format: 0898-7654-321 -> 0898-7654-321
    return phone.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      paddingVertical: 30,
      paddingHorizontal: 20,
    },
    avatarContainer: {
      marginBottom: 15,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 36,
      color: 'white',
      fontWeight: 'bold',
    },
    fullName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
      textAlign: 'center',
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    employeeCode: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: 'monospace',
      marginBottom: 5,
    },
    role: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 20,
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
    infoRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoRowLast: {
      borderBottomWidth: 0,
    },
    infoLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
    },
    infoValue: {
      flex: 1.5,
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'right',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 14,
      fontWeight: '600',
    },
    logoutButton: {
      marginHorizontal: 20,
      backgroundColor: colors.danger,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
  });

  // Ambil initial dari nama untuk avatar
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Loading state
  if (isLoading && !currentEmployee) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.errorText, { marginTop: 15 }]}>
          Memuat data profil...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && !currentEmployee) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => user?.id && dispatch(fetchEmployeeByUserId(user.id))}
        >
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentEmployee?.full_name 
                  ? getInitials(currentEmployee.full_name)
                  : user?.email 
                  ? getInitials(user.email)
                  : 'U'
                }
              </Text>
            </View>
          </View>
          
          <Text style={styles.fullName}>
            {currentEmployee?.full_name || 'Nama Tidak Tersedia'}
          </Text>
          <Text style={styles.email}>{user?.email || '-'}</Text>
          <Text style={styles.employeeCode}>
            {currentEmployee?.employee_code || '-'}
          </Text>
          <Text style={styles.role}>{user?.role || 'User'}</Text>
        </View>

        {/* Informasi Pekerjaan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pekerjaan</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Departemen</Text>
              <Text style={styles.infoValue}>
                {currentEmployee?.department || '-'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Posisi</Text>
              <Text style={styles.infoValue}>
                {currentEmployee?.position || '-'}
              </Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Tanggal Bergabung</Text>
              <Text style={styles.infoValue}>
                {currentEmployee?.hire_date 
                  ? formatDate(currentEmployee.hire_date)
                  : '-'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Informasi Kontak */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Kontak</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>No. Telepon</Text>
              <Text style={styles.infoValue}>
                {formatPhone(currentEmployee?.phone || '')}
              </Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || '-'}</Text>
            </View>
          </View>
        </View>

        {/* Status Akun */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Akun</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue}>{user?.id || '-'}</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: currentEmployee?.is_active ? '#34C759' : '#FF3B30' }
                  ]} 
                />
                <Text 
                  style={[
                    styles.statusText, 
                    { color: currentEmployee?.is_active ? '#34C759' : '#FF3B30' }
                  ]}
                >
                  {currentEmployee?.is_active ? 'Aktif' : 'Nonaktif'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}