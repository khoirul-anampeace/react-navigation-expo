import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState<boolean>(true);
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const dispatch = useAppDispatch();

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      backgroundColor: colors.card,
      marginTop: 20,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      paddingVertical: 15,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    arrow: {
      fontSize: 24,
      color: colors.textSecondary,
    },
    danger: {
      color: colors.danger,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferensi</Text>
        
        {/* <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifikasi</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications ? colors.primary : '#f4f3f4'}
          />
        </View> */}
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Mode Gelap</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Akun</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Ubah Password</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Privasi</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleLogout}
        >
          <Text style={[styles.settingLabel, styles.danger]}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}