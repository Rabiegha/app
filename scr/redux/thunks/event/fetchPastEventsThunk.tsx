import {createAsyncThunk} from '@reduxjs/toolkit';
import {demoEvents} from '../../../demo/demoEvents';
import {fetchEventList} from '../../../services/eventsListService';

export const fetchPastEvents = createAsyncThunk(
  'fetchPastEvents',
  async ({userId, isDemoMode}, {rejectWithValue}) => {
    try {
      if (isDemoMode) {
        return {events: demoEvents, timeStamp: Date.now()};
      } else {
        const response = await fetchEventList(userId, 0);
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
