import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAttendeesList } from '../../../services/getAttendeesListService';
import { demoEvents } from '../../../demo/demoEvents';

export const fetchMainAttendees = createAsyncThunk(
  'attendees/fetchMainAttendees',
  async ({ userId, eventId, isDemoMode }: { userId: string; eventId: string; isDemoMode: boolean }, thunkAPI) => {
    try {
      if (isDemoMode) {
        const selectedEvent = demoEvents.find(e => e.event_id == eventId);
        return selectedEvent ? selectedEvent.participants : [];
      }
      const attendees = await fetchAttendeesList(userId, eventId);
      return attendees || [];
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch main attendees');
    }
  }
);
