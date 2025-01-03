import {createSlice} from '@reduxjs/toolkit';
import {fetchPastEvents} from '../../thunks/event/fetchPastEventsThunk';

const initialState = {
  events: [],
  loading: false,
  error: null,
  timeStamp: null,
};

const pastEventsSlice = createSlice({
  name: 'pastEvents',
  initialState,
  reducers: {
    clearPastEvents: state => {
      state.events = [];
      state.timeStamp = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPastEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.timeStamp = action.payload.timeStamp;
        state.error = null;
      })
      .addCase(fetchPastEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch past events';
      });
  },
});

export const {clearPastEvents} = pastEventsSlice.actions;
export default pastEventsSlice.reducer;
