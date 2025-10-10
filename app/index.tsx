import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../src/context/ThemeContext';
import RootNavigator from '../src/navigation/RootNavigator';
import { store } from '../src/store/store';

export default function Index() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}