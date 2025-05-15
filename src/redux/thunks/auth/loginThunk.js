import axios from 'axios';
import {BASE_URL} from '../../../config/config';
import {Buffer} from 'buffer';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const loginThunk = createAsyncThunk(
  'loginThunk',
  async ({email, password}, thunkAPI) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort(); // ⏳ Annule la requête si elle prend trop de temps
    thunkAPI.rejectWithValue('Login timeout exceeded');
  }, 10000); // ⏳ Timeout de 10s
    try {

      // Encode to base64
      const encodeBase64 = value => Buffer.from(value).toString('base64');
      const encUserName = encodeURIComponent(encodeBase64(email));
      const encPassword = encodeURIComponent(encodeBase64(password));

      // API call
      const url = `${BASE_URL}/ajax_user_login/?enc_email=${encUserName}&enc_password=${encPassword}`;
      const response = await axios.post(url, { signal: controller.signal });

      clearTimeout(timeout);

      // If success
      if (response.data.status) {
        return response.data.user_details;
      } else {
        return thunkAPI.rejectWithValue('Login failed');
      }
    } catch (error) {
      clearTimeout(timeout);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
