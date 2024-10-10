// redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import printerReducer from './printerSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['printers'], // Assurez-vous que 'printers' est inclus
};

const rootReducer = combineReducers({
  printers: printerReducer,
  // Ajoutez d'autres reducers ici si nécessaire
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
