import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchEventAttendeeList } from '../../services/getAttendeesList';
import { BASE_URL } from '../../config/config';
import { demoEvents } from '../../demo/demoEvents';

// Action asynchrone pour récupérer la liste des participants
export const fetchAttendees = createAsyncThunk(
  'attendees/fetchAttendees',
  async ({ userId, eventId, isDemoMode }) => {
    let attendees = [];
    if (isDemoMode) {
      const selectedEvent = demoEvents.find(e => e.event_id == eventId);
      if (selectedEvent) {
        attendees = selectedEvent.participants;
      }
    } else {
      attendees = await fetchEventAttendeeList(userId, eventId);
      if (!attendees) attendees = [];
    }
    return attendees;
  }
);

// Action asynchrone pour mettre à jour un participant
export const updateAttendee = createAsyncThunk(
  'attendees/updateAttendee',
  async (updatedAttendee, { dispatch }) => {
    const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${updatedAttendee.event_id}&attendee_id=${updatedAttendee.id}&attendee_status=${updatedAttendee.attendee_status}`;
    await axios.post(url);
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
    }
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
  }
});

export const { updateAttendeeLocally, clearAttendees } = attendeesSlice.actions;
export default attendeesSlice.reducer;
