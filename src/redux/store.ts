// redux/store.ts

import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import printerReducer from './slices/printerSlice';
import pastEventsReducer from './slices/event/pastEventsSlice';
import futureEventsReducer from './slices/event/futureEventsSlice';
import authReducer from './slices/authSlice';
import scanReducer from './slices/scanModeSlice';
import searchSlice from './slices/searchModeSlice';
import attendeeReducer from './slices/attendee/attendeeSlice';
import sessionAttendeesReducer from './slices/attendee/sessionAttendeesListSlice';

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

// Auth
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const isKioskModePersistConfig = {
  key: 'isKioskMode',
  storage: AsyncStorage,
};

const isSearchByCompanyModeConfig = {
  key: 'isSearchByCompanyMode',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  printers: printerReducer,
  attendee: attendeeReducer,
  sessionAttendees: sessionAttendeesReducer,
  scan: persistReducer(isKioskModePersistConfig, scanReducer),
  search: persistReducer(isSearchByCompanyModeConfig, searchSlice),
  /*   pastEvents: persistReducer(pastEventsPersistConfig, pastEventsReducer),
  futureEvents: persistReducer(futureEventsPersistConfig, futureEventsReducer), */
  pastEvents: pastEventsReducer,
  futureEvents: futureEventsReducer,
  auth: persistReducer(authPersistConfig, authReducer),
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
      immutableCheck: {
        warnAfter: 128,
        ignoredPaths: ['attendees', 'attendee.list'],
      },
    }),
});

export const persistor = persistStore(store);

// Export types for Redux usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
