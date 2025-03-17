import {createSlice} from '@reduxjs/toolkit';
import {loginThunk} from '../thunks/auth/loginThunk';
import {logoutThunk} from '../thunks/auth/logoutThunk';

const initialState = {
  currentUserId: '',
  userInfo: {},
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload;
      state.currentUserId = action.payload.current_user_login_details_id;
      state.error = null;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Login failed';
    });

    // Logout
    builder.addCase(logoutThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutThunk.fulfilled, state => {
      state.isLoading = false;
      state.error = null;
      state.currentUserId = '';
      state.userInfo = {};
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Logout failed';
    });
  },
});

export const {resetError} = authSlice.actions;
export default authSlice.reducer;
