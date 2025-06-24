/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, { useEffect } from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import {navigationRef} from './src/navigation/RootNavigation';
import AppProviders from './AppProviders';
import { toastConfig } from './src/app/toastConfig';


import { connectWebSocket } from '@/services/socket/SocketService';

function App() {
  useEffect(() => {
    connectWebSocket();
  }, []);
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
