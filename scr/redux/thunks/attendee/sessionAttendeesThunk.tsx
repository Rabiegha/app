// redux/thunks/attendees/fetchSessionAttendees.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEventAttendeeList } from '../../../services/getAttendeesList';

export const fetchSessionAttendees = createAsyncThunk(
  'sessionAttendees/fetchSessionAttendees',
  async ({ userId, eventId}: { userId: string; eventId: string }, thunkAPI) => {
    return fetchEventAttendeeList(userId, eventId, undefined, 1);
  }
);
