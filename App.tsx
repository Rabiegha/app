/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppNavigator from './scr/navigation/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {navigationRef} from './scr/navigation/RootNavigation';
import AppProviders from './AppProviders';
import Toast from 'react-native-toast-message';
import { toastConfig } from './scr/app/toastConfig';

function App() {
  return (
    <AppProviders>
      <NavigationContainer ref={navigationRef}>
        <GestureHandlerRootView style={{flex: 1}}>
          <AppNavigator />
        </GestureHandlerRootView>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </AppProviders>
  );
}

export default App;
