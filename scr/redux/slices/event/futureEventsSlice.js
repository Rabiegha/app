import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchEventDetails} from '../../../services/eventsListService';
import {demoEvents} from '../../../demo/demoEvents';

const initialState = {
  events: [],
  loading: false,
  error: null,
  timeStamp: null,
};

export const fetchFutureEvents = createAsyncThunk(
  'fetchFutureEvents',
  async ({userId, isEventFromList, isDemoMode}, {rejectWithValue}) => {
    try {
      if (isDemoMode) {
        return {events: demoEvents, timeStamp: Date.now()};
      } else {
        const combinedEvents = [];
        for (const isEventFrom of isEventFromList) {
          const response = await fetchEventDetails(userId, isEventFrom);
          if (response.status && response.event_details) {
            combinedEvents.push(...response.event_details);
          }
        }
        return {
          events: combinedEvents,
          timeStamp: Date.now(),
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch future events');
    }
  },
);

const futureEventsSlice = createSlice({
  name: 'futureEvents',
  initialState,
  reducers: {
    clearFutureEvents: state => {
      state.events = [];
      state.timeStamp = null;
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
