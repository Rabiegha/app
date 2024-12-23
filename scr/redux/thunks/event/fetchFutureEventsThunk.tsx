import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchEventDetails} from '../../../services/eventsListService';
import {demoEvents} from '../../../demo/demoEvents';

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