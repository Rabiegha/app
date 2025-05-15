import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {AuthProvider} from './src/context/AuthContext';
import {EventProvider} from './src/context/EventContext';
import { PrintStatusProvider } from './src/printing/context/PrintStatusContext';
import { store, persistor } from './src/redux/store';

export default function AppProviders({children}: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <EventProvider>
            <PrintStatusProvider>
              {children}
            </PrintStatusProvider>
          </EventProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
