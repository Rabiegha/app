import axios from 'axios';
import {BASE_URL} from '../../../config/config';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const logoutThunk = createAsyncThunk(
  'logoutThunk',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const currentUserId = state.auth.currentUserId;

    if (!currentUserId) {
      return thunkAPI.rejectWithValue('No user is currently logged in');
    }

    const controller = new AbortController(); // 🚀 Crée un contrôleur pour annuler la requête
    const timeout = setTimeout(() => {
      controller.abort(); // ⏳ Annule la requête après 10s
      thunkAPI.rejectWithValue('Logout timeout exceeded');
    }, 10000);

    try {
      const url = `${BASE_URL}/ajax_user_logout/?current_user_login_details_id=${currentUserId}`;
      const response = await axios.post(url, { signal: controller.signal });

      clearTimeout(timeout);

      if (response.data.status) {
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
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);