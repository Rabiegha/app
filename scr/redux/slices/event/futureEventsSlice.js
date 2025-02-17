import {createSlice} from '@reduxjs/toolkit';
import {fetchFutureEvents} from '../../thunks/event/fetchFutureEventsThunk.tsx';

const initialState = {
  events: null,
  loading: false,
  error: null,
  timeStamp: null,
};

const futureEventsSlice = createSlice({
  name: 'futureEvents',
  initialState,
  reducers: {
    clearFutureEvents: state => {
      state.events = null;
      state.timeStamp = null;
      state.error = null;
      state.loading = null;
    },
    testSetLoading: (state, action) => {
      state.loading = action.payload;
    },
    testSetError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFutureEvents.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFutureEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.timeStamp = action.payload.timeStamp;
      })
      .addCase(fetchFutureEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch future events';
      });
  },
});

export const {clearFutureEvents} = futureEventsSlice.actions;
export default futureEventsSlice.reducer;
