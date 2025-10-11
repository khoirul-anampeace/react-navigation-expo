import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { HomeStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: 'normal',
      marginBottom: 10,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 30,
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 8,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Absen tidak ditemukan</Text>
      {/* <Text style={styles.subtitle}>Ini adalah Home Screen</Text> */}
      
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Details', { 
          itemId: 86,
          itemName: 'Contoh Item' 
        })}
      >
        <Text style={styles.buttonText}>Lihat Detail</Text>
      </TouchableOpacity> */}
    </View>
  );
}