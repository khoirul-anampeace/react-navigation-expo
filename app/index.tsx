import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../src/context/ThemeContext';
import AuthNavigator from '../src/navigation/AuthNavigator';
import RootNavigator from '../src/navigation/RootNavigator';
import { useAppSelector } from '../src/store/hooks';
import { store } from '../src/store/store';

function AppContent() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return isAuthenticated ? <RootNavigator /> : <AuthNavigator />;
}

export default function Index() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});