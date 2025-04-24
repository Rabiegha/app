import { createSlice } from '@reduxjs/toolkit';
import { updateAttendee } from '../../thunks/attendee/updateAttendeeThunk';
import { fetchMainAttendees } from '../../thunks/attendee/mainAttendeesThunk';


const attendeesSlice = createSlice({
  name: 'attendees',
  initialState: {
    data: [],
    isLoadingList: false,
    isUpdating: false,
    error: null,
  },
  reducers: {

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
        state.isLoadingList = true;
        state.error = null;
      })
      .addCase(fetchMainAttendees.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoadingList = false;
      })
      .addCase(fetchMainAttendees.rejected, (state, action) => {
        state.isLoadingList = false;
        state.error = action.error.message;
      })
      .addCase(updateAttendee.pending, state => {
        state.isUpdating = true;
      })
      .addCase(updateAttendee.fulfilled, (state, action) => {
        const updated = action.payload;
        state.data = state.data.map(attendee =>
          attendee.id === updated.id ? updated : attendee
        );
        state.isUpdating = false;
      })
      .addCase(updateAttendee.rejected, (state, action) => {
        const { original } = action.payload;
        // Rollback
        state.data = state.data.map(a =>
          a.id === original.id
            ? { ...a, attendee_status: original.attendee_status === 1 ? 0 : 1 }
            : a
        );
        state.isUpdating = false;
      });

  },
});

export const { updateAttendeeLocally, clearAttendees } = attendeesSlice.actions;
export default attendeesSlice.reducer;
