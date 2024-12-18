// redux/store.js

import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';

import printerReducer from './slices/printerSlice';
import eventReducer from './slices/eventSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['printers'],
};

const rootReducer = combineReducers({
  printers: printerReducer,
  events: eventReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
