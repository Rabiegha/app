import {createSlice} from '@reduxjs/toolkit';
import {fetchPastEvents} from '../../thunks/event/fetchPastEventsThunk';

const initialState = {
  events: null,
  loading: false,
  error: null,
  timeStamp: null,
};

const pastEventsSlice = createSlice({
  name: 'pastEvents',
  initialState,
  reducers: {
    clearPastEvents: state => {
      state.events = null;
/*       state.timeStamp = null; */
      state.error = null;
      state.loading = null;
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
      })
      .addCase(fetchPastEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch past events';
      });
  },
});

export const {clearPastEvents} = pastEventsSlice.actions;
export default pastEventsSlice.reducer;
