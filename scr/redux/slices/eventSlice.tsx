import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {demoEvents} from '../../demo/demoEvents';
import {fetchEventDetails} from '../../services/serviceApi';

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
          if (response.data.satatus && response.data.event_details) {
            combinedEvents = combinedEvents.concat(response.data.event_details);
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
      state.timestamp = null;
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
        state.timestamp = action.payload.timestamp;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearEvents} = eventSlice.actions;
export default eventSlice.reducer;
