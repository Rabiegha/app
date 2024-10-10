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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {navigationRef} from './scr/navigation/RootNavigation';
import {Provider} from 'react-redux';
import {persistor, store} from './scr/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <EventProvider>
            <NavigationContainer ref={navigationRef}>
              <GestureHandlerRootView style={{flex: 1}}>
                <AppNavigator />
              </GestureHandlerRootView>
            </NavigationContainer>
          </EventProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
