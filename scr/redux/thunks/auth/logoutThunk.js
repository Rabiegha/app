import axios from 'axios';
import {BASE_URL} from '../../../config/config';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const logoutThunk = createAsyncThunk(
  'logoutThunk',
  async (_, thunkAPI) => {
    // We can read the current state from thunkAPI if needed
    const state = thunkAPI.getState();
    const currentUserId = state.auth.currentUserId;

    // If you're in demo mode, or need other logic, handle it here
    try {
      if (!currentUserId) {
        console.log('No user is currently logged in');
        return; // or throw
      }

      // Call the logout API
      const url = `${BASE_URL}/ajax_user_logout/?current_user_login_details_id=${currentUserId}`;
      const response = await axios.post(url);

      if (response.data.status) {
        console.log('Logout successful');
        return;
      } else {
        return thunkAPI.rejectWithValue('Logout failed');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
