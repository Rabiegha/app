import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {demoEvents} from '../../demo/demoEvents';
import {fetchEventDetails} from '../../services/serviceApi';
import {useEffect} from 'react';

const initialState = {
  events: [],
  loading: false,
  error: null,
  timeStamp: null,
};

export const fetchEvents = createAsyncThunk(
  'fetchEvents',
  async ({userId, isEventFromList, isDemoMode}, {rejectWithValue}) => {
    try {
      if (isDemoMode) {
        return {events: demoEvents, timeStamp: Date.now()};
      } else {
        let combinedEvents = [];
        for (const isEventFrom of isEventFromList) {
          const response = await fetchEventDetails(userId, isEventFrom);
          try {
            if (response.status && response.event_details) {
              combinedEvents = combinedEvents.concat(response.event_details);
            }
          } catch (error) {
            console.error(
              `Failed to fetch events for isEventFrom=${isEventFrom}:`,
              error.message,
            );
          }
        }
        return {events: combinedEvents, timeStamp: Date.now()};
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  },
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents: state => {
      state.events = [];
      state.timeStamp = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.timeStamp = action.payload.timeStamp;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch events';
      });
  },
});

export const {clearEvents} = eventSlice.actions;
export default eventSlice.reducer;
