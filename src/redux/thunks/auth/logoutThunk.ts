import axios from 'axios';
import {BASE_URL} from '../../../config/config';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {persistor} from '../../store';
import {LogoutResponse} from '../../../types/auth.types';
import {RootState} from '../../store';

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
      return thunkAPI.rejectWithValue('Logout timeout exceeded');
    }, 10000);

    try {
      const url = `${BASE_URL}/ajax_user_logout/?current_user_login_details_id=${currentUserId}`;
      const response = await axios.post<LogoutResponse>(url, { signal: controller.signal });

      clearTimeout(timeout);

      if (response.data.status) {
        // Clear persisted state
        await persistor.purge();
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
