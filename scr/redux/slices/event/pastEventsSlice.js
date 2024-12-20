import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchEventDetails} from '../../../services/eventsListService';
import {demoEvents} from '../../../demo/demoEvents';

const initialState = {
  events: [],
  loading: false,
  error: null,
  timeStamp: null,
};

export const fetchPastEvents = createAsyncThunk(
  'fetchPastEvents',
  async ({userId, isDemoMode}, {rejectWithValue}) => {
    try {
      if (isDemoMode) {
        return {events: demoEvents, timeStamp: Date.now()};
      } else {
        const response = await fetchEventDetails(userId, 0);
        return {
          events: response.event_details || [],
          timeStamp: Date.now(),
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch past events');
    }
  },
);

const pastEventsSlice = createSlice({
  name: 'pastEvents',
  initialState,
  reducers: {
    clearPastEvents: state => {
      state.events = [];
      state.timeStamp = null;
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
