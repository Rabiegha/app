/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {navigationRef} from './src/navigation/RootNavigation';
import AppProviders from './AppProviders';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/app/toastConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <NavigationContainer ref={navigationRef}>
          <GestureHandlerRootView style={{flex: 1}}>
            <AppNavigator />
          </GestureHandlerRootView>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </AppProviders>
    </SafeAreaProvider>
  );
}

export default App;
