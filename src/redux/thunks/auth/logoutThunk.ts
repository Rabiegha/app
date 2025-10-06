import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

import {BASE_URL} from '../../../config/config';
import {LogoutResponse} from '../../../types/auth.types';
import {persistor, RootState} from '../../store';
import {clearPastEvents} from '../../slices/event/pastEventsSlice';
import {clearFutureEvents} from '../../slices/event/futureEventsSlice';

export const logoutThunk = createAsyncThunk<
  void,
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'logoutThunk',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const currentUserId = state.auth.currentUserId;

    if (!currentUserId) {
      return thunkAPI.rejectWithValue('No user is currently logged in');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const url = `${BASE_URL}/ajax_user_logout/?current_user_login_details_id=${currentUserId}`;
      const response = await axios.post<LogoutResponse>(url, { signal: controller.signal });

      clearTimeout(timeout);

      if (response.data.status) {
        // Clear events data before purging persistor
        thunkAPI.dispatch(clearPastEvents());
        thunkAPI.dispatch(clearFutureEvents());
        
        // Clear persisted state with timeout
        try {
          await Promise.race([
            persistor.purge(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Purge timeout')), 3000))
          ]);
        } catch (purgeError) {
          console.warn('Persistor purge failed or timed out:', purgeError);
          // Continue anyway, the user will be logged out
        }
        return;
      } else {
        return thunkAPI.rejectWithValue('Logout failed');
      }
    } catch (error) {
      clearTimeout(timeout);
      if (axios.isCancel(error)) {
        return thunkAPI.rejectWithValue('Request was cancelled');
      }
      const err = error as Error;
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
