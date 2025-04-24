import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateAttendeeStatus } from '../../../services/updateAttendeeStatusService';

// Action asynchrone pour mettre à jour un participant
export const updateAttendee = createAsyncThunk(
    'attendees/updateAttendee',
    async (updatedAttendee, { rejectWithValue }) => {

      try {
        await updateAttendeeStatus(updatedAttendee);
        return updatedAttendee;
      }
      catch (error) {
        return rejectWithValue({
          errorMessage: 'Update failed',
          original: updatedAttendee,
        });
      }
    }
  );
