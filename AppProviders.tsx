import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {AuthProvider} from './scr/context/AuthContext';
import {EventProvider} from './scr/context/EventContext';
import {store, persistor} from './scr/redux/store';

export default function AppProviders({children}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <EventProvider>{children}</EventProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
