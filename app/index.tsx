import { useEffect } from 'react';
import { ActivityIndicator, DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../src/context/ThemeContext';
import AuthNavigator from '../src/navigation/AuthNavigator';
import RootNavigator from '../src/navigation/RootNavigator';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { checkAuth, logoutUser } from '../src/store/slices/authSlice';
import { store } from '../src/store/store';

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Check authentication status when app starts
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Listen for forced logout events
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('forceLogout', () => {
      console.log('🔄 Force logout triggered');
      dispatch(logoutUser());
    });

    return () => subscription.remove();
  }, [dispatch]);

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
