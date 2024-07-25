/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppNavigator from './scr/navigation/NavigationComponent';
import {EventProvider} from './scr/context/EventContext';
import {AuthProvider} from './scr/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <NavigationContainer>
          <GestureHandlerRootView style={{flex: 1}}>
            <AppNavigator />
          </GestureHandlerRootView>
        </NavigationContainer>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
