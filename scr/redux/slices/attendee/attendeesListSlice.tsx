import { createSlice } from '@reduxjs/toolkit';
import { updateAttendee } from '../../thunks/attendee/updateAttendeeThunk';
import { fetchMainAttendees } from '../../thunks/attendee/mainAttendeesThunk';


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
      .addCase(fetchMainAttendees.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMainAttendees.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchMainAttendees.rejected, (state, action) => {
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
