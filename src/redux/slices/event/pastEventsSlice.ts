import {createSlice} from '@reduxjs/toolkit';

import {fetchPastEvents} from '../../thunks/event/fetchPastEventsThunk';
import {Event} from '../../../types/event.types';

const initialState = {
  events: null as Event[] | null,
  loading: false,
  error: null as string | null,
  timeStamp: null as number | null,
};

const pastEventsSlice = createSlice({
  name: 'pastEvents',
  initialState,
  reducers: {
    clearPastEvents: state => {
      state.events = null;
/*       state.timeStamp = null; */
      state.error = null;
      state.loading = false;
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
        state.error = action.payload as string || 'Failed to fetch past events';
      });
  },
});

export const {clearPastEvents} = pastEventsSlice.actions;
export default pastEventsSlice.reducer;
