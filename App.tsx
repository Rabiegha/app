/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppNavigator from './scr/navigation/NavigationComponent';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {navigationRef} from './scr/navigation/RootNavigation';
import AppProviders from './AppProviders';

function App() {
  return (
    <AppProviders>
      <NavigationContainer ref={navigationRef}>
        <GestureHandlerRootView style={{flex: 1}}>
          <AppNavigator />
        </GestureHandlerRootView>
      </NavigationContainer>
    </AppProviders>
  );
}

export default App;
