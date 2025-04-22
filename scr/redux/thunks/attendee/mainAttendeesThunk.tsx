import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEventAttendeeList } from '../../../services/getAttendeesList';
import { demoEvents } from '../../../demo/demoEvents';

export const fetchMainAttendees = createAsyncThunk(
  'attendees/fetchMainAttendees',
  async ({ userId, eventId, isDemoMode }: { userId: string; eventId: string; isDemoMode: boolean }, thunkAPI) => {
    try {
      if (isDemoMode) {
        const selectedEvent = demoEvents.find(e => e.event_id == eventId);
        return selectedEvent ? selectedEvent.participants : [];
      }
      const attendees = await fetchEventAttendeeList(userId, eventId);
      return attendees || [];
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch main attendees');
    }
  }
);
