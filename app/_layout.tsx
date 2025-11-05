import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../src/config/toastConfig';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}