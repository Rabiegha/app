import { createSlice } from '@reduxjs/toolkit';
import { fetchSessionAttendees } from '../../thunks/attendee/sessionAttendeesThunk';

const sessionAttendeesSlice = createSlice({
  name: 'sessionAttendees',
  initialState: { data: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSessionAttendees.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchSessionAttendees.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSessionAttendees.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  }


});

export default sessionAttendeesSlice.reducer;
