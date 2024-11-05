// redux/store.js

import {configureStore} from '@reduxjs/toolkit';
import printerReducer from './slices/printerSlice';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import eventReducer from './slices/eventSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['printers'],
};

const rootReducer = combineReducers({
  printers: printerReducer,
  events: eventReducer,
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
