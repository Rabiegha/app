import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateAttendeeStatus } from '../../../services/attendeeService';
import { Attendee, UpdateAttendeeStatusParams } from '../../../types/attendee.types';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../selectors/auth/authSelectors';

// Action asynchrone pour mettre à jour un participant
export const updateAttendee = createAsyncThunk(
    'attendees/updateAttendee',
    async (updatedAttendee: Attendee, { rejectWithValue, getState }) => {
      try {
        // Get the current user ID from Redux state
        const state = getState() as any;
        const userId = state.auth.currentUser?.id;
        
        if (!userId || !updatedAttendee.event_id) {
          return rejectWithValue({
            errorMessage: 'Missing required parameters',
            original: updatedAttendee,
          });
        }
        
        // Create the params object with the correct types
        const params: UpdateAttendeeStatusParams = {
          userId: userId,
          eventId: updatedAttendee.event_id.toString(), // Convert to string as required by the type
          attendeeId: updatedAttendee.id.toString(),
          status: updatedAttendee.attendee_status
        };
        
        // Call the service with the correct parameters
        const success = await updateAttendeeStatus(params);
        
        if (success) {
          return updatedAttendee;
        } else {
          return rejectWithValue({
            errorMessage: 'Update failed',
            original: updatedAttendee,
          });
        }
      }
      catch (error) {
        return rejectWithValue({
          errorMessage: 'Update failed',
          original: updatedAttendee,
        });
      }
    }
  );
