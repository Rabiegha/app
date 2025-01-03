import {createSlice} from '@reduxjs/toolkit';
import {fetchFutureEvents} from '../../thunks/event/fetchFutureEventsThunk.tsx';

const initialState = {
  events: [],
  loading: false,
  error: null,
  timeStamp: null,
};

const futureEventsSlice = createSlice({
  name: 'futureEvents',
  initialState,
  reducers: {
    clearFutureEvents: state => {
      state.events = [];
      state.timeStamp = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFutureEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFutureEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.timeStamp = action.payload.timeStamp;
      })
      .addCase(fetchFutureEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch future events';
      });
  },
});

export const {clearFutureEvents} = futureEventsSlice.actions;
export default futureEventsSlice.reducer;
