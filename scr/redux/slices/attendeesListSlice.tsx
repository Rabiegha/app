import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchEventAttendeeList } from '../../services/getAttendeesList';
import { BASE_URL } from '../../config/config';
import { demoEvents } from '../../demo/demoEvents';
import { updateAttendeeStatus } from '../../services/updateAttendeeStatusService';

// Action asynchrone pour récupérer la liste des participants
export const fetchAttendees = createAsyncThunk(
    'attendees/fetchAttendees',
    async (    {
      userId,
      eventId,
      isDemoMode,
      attendeeStatus, // ⬅️ param optionnel
    }: {
      userId: string;
      eventId: string;
      isDemoMode: boolean;
      attendeeStatus?: number;
    }, thunkAPI) => {

      let attendees = [];

      // Create a timeout promise that rejects after 10 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );

      if (isDemoMode) {
        const selectedEvent = demoEvents.find(e => e.event_id == eventId);
        if (selectedEvent) {
          attendees = selectedEvent.participants;
        }
        return attendees;
      } else {
        try {
          // Race the fetch promise with the timeout
          attendees = await Promise.race([
            fetchEventAttendeeList(userId, eventId, undefined, attendeeStatus),
            timeoutPromise,
          ]);
          if (!attendees) {attendees = [];}
          return attendees;
        } catch (error) {
          // Reject with a custom error message (e.g., timeout error)
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    }
  );

// Action asynchrone pour mettre à jour un participant
export const updateAttendee = createAsyncThunk(
  'attendees/updateAttendee',
  async (updatedAttendee, { dispatch }) => {
    await updateAttendeeStatus(updatedAttendee);
    // On peut aussi déclencher un refresh si besoin ici
    return updatedAttendee;
  }
);

const attendeesSlice = createSlice({
  name: 'attendees',
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // Pour les mises à jour locales si besoin
    updateAttendeeLocally(state, action) {
      const updated = action.payload;
      state.data = state.data.map(attendee =>
        attendee.id === updated.id ? updated : attendee
      );
    },
    clearAttendees(state) {
      state.data = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAttendees.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendees.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAttendees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateAttendee.fulfilled, (state, action) => {
        // Mise à jour dans le store après succès
        const updated = action.payload;
        state.data = state.data.map(attendee =>
          attendee.id === updated.id ? updated : attendee
        );
      });
  },
});

export const { updateAttendeeLocally, clearAttendees } = attendeesSlice.actions;
export default attendeesSlice.reducer;
