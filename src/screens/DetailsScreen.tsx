import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { HomeStackParamList } from '../types/navigation';

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Details'
>;

type DetailsScreenRouteProp = RouteProp<HomeStackParamList, 'Details'>;

interface Props {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
}

export default function DetailsScreen({ route, navigation }: Props) {
  const { itemId, itemName } = route.params;
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.text,
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 15,
      marginBottom: 5,
    },
    value: {
      fontSize: 18,
      color: colors.text,
      fontWeight: '600',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Detail Item</Text>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{itemId}</Text>
        <Text style={styles.label}>Nama:</Text>
        <Text style={styles.value}>{itemName}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}