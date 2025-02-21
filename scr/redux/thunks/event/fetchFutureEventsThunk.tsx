import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchEventList} from '../../../services/eventsListService';
import {demoEvents} from '../../../demo/demoEvents';

export const fetchFutureEvents = createAsyncThunk(
  'fetchFutureEvents',
  async ({userId, isEventFromList, isDemoMode}, {rejectWithValue}) => {
    try {
      if (isDemoMode) {
        // Return demo events immediately
        return {events: demoEvents, timeStamp: Date.now()};
      } else {
        const combinedEvents = [];
        let failedCount = 0; // Track how many fail

        for (const isEventFrom of isEventFromList) {
          try {
            const response = await fetchEventList(userId, isEventFrom);
            // If fetchEventList doesn't throw, push in the event_details
            if (response.status && response.event_details) {
              combinedEvents.push(...response.event_details);
            } else {
              // The response is "invalid", so count it as a failure
              failedCount++;
            }
          } catch (innerError) {
            // Catch any error thrown by fetchEventList
            console.warn(`Skipping isEventFrom=${isEventFrom}`, innerError);
            failedCount++;
          }
        }

        // If *all* requests fail, return an error
        if (failedCount === isEventFromList.length) {
          // This will make the reducer's rejected case get the error message
          throw new Error('Failed to fetch any events');
        }

        // Otherwise, we got partial or full success
        return {events: combinedEvents, timeStamp: Date.now()};
      }
    } catch (error) {
      // If we get here, *everything* failed
      return rejectWithValue(error.message || 'Failed to fetch future events');
    }
  },
);
