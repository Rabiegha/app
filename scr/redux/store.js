// redux/store.js

import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';

import printerReducer from './slices/printerSlice';
import pastEventsReducer from './slices/event/pastEventsSlice';
import futureEventsReducer from './slices/event/futureEventsSlice';
import authReducer from './slices/auth/authSlice';

// pastEvents
const pastEventsPersistConfig = {
  key: 'pastEvents',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'], // Only persist 'events' & 'timeStamp'
};

// futureEvents
const futureEventsPersistConfig = {
  key: 'futureEvents',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const rootReducer = combineReducers({
  printers: printerReducer,
  pastEvents: persistReducer(pastEventsPersistConfig, pastEventsReducer),
  futureEvents: persistReducer(futureEventsPersistConfig, futureEventsReducer),
  auth: authReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['printers', 'pastEvents', 'futureEvents', 'auth'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
