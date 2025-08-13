import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { 
  Attendee, 
  AttendeeDetails,
  AttendeeState
} from './attendee.types';
import { addAttendeeThunk, editAttendeeThunk, fetchAttendeeDetails, fetchAttendeesList, updateAttendeeFieldThunk, updateAttendeeStatusThunk } from './attendee.thunks';

// Helper function to map API field names to selectedAttendee property names
const mapFieldToSelectedAttendee = (field: string, value: string): Partial<AttendeeDetails> => {
  // Map API field names to selectedAttendee property names
  switch (field) {
    case 'first_name':
      return { firstName: value };
    case 'last_name':
      return { lastName: value };
    case 'email':
      return { email: value };
    case 'phone':
      return { phone: value };
    case 'organization':
      return { organization: value };
    case 'job_title':
      return { jobTitle: value };
    case 'attendee_status':
      return { attendeeStatus: Number(value) };
    case 'attendee_status_change_datetime':
      return { attendeeStatusChangeDatetime: value };
    case 'comment':
      return { commentaire: value };
    default:
      return {};
  }
};



// Initial state
const initialState: AttendeeState = {
  list: [],
  selectedAttendee: null,
  isLoadingList: false,
  isLoadingDetails: false,
  isUpdating: false,
  error: null,
  loadingAttendeeId: null,
};

// Slice
const attendeeSlice = createSlice({
  name: 'attendees',
  initialState,
  reducers: {
    clearAttendees(state) {
      state.list = [];
      state.error = null;
      state.isLoadingList = false;
    },
    clearSelectedAttendee(state) {
      // Définir isLoadingDetails à true avant d'effacer selectedAttendee
      // pour s'assurer que le skeleton s'affiche immédiatement
      state.isLoadingDetails = true;
      state.selectedAttendee = null;
    },

    updateAttendeeLocally(state, action) {
        const updated = action.payload;
        
        // Update in the list
        state.list = state.list.map(attendee =>
          attendee.id === updated.id ? updated : attendee
        );
        
        // Also update the selectedAttendee if it's the same attendee
        if (state.selectedAttendee && 
            state.selectedAttendee.theAttendeeId === updated.id.toString()) {
          
          // Update the check-in status
          state.selectedAttendee = {
            ...state.selectedAttendee,
            attendeeStatus: updated.attendee_status,
            // Update the timestamp for check-in/out
            attendeeStatusChangeDatetime: updated.attendee_status === 1 ? 
              new Date().toLocaleString('fr-FR') : '-'
          };
        }
      },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list cases
      .addCase(fetchAttendeesList.pending, (state) => {
        state.isLoadingList = true;
        state.error = null;
      })
      .addCase(fetchAttendeesList.fulfilled, (state, action: PayloadAction<Attendee[]>) => {
        state.list = action.payload;
        state.isLoadingList = false;
      })
      .addCase(fetchAttendeesList.rejected, (state, action) => {
        state.isLoadingList = false;
        state.error = action.error.message || 'Failed to fetch attendees';
      })
      
      // Fetch details cases
      .addCase(fetchAttendeeDetails.pending, (state, action) => {
        // Mettre isLoadingDetails à true mais ne pas effacer selectedAttendee
        // pour éviter le flash du composant vide
        state.isLoadingDetails = true;
        state.error = null;
        state.loadingAttendeeId = action.meta.arg.attendeeId || null;
        // Ne pas effacer selectedAttendee ici pour éviter le flash
      })
      .addCase(fetchAttendeeDetails.fulfilled, (state, action) => {
        state.selectedAttendee = action.payload;
        state.isLoadingDetails = false;
        state.loadingAttendeeId = null;
      })
      .addCase(fetchAttendeeDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.error.message || 'Failed to fetch attendee details';
        state.loadingAttendeeId = null;
      })
      
      // Add attendee cases
      .addCase(addAttendeeThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addAttendeeThunk.fulfilled, (state, action: PayloadAction<Attendee>) => {
        // Ajouter le nouveau participant au début de la liste
        state.list = [action.payload, ...state.list];
        state.isUpdating = false;
      })
      .addCase(addAttendeeThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to add attendee';
      })
      
      // Update status cases
      .addCase(updateAttendeeStatusThunk.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateAttendeeStatusThunk.fulfilled, (state, action: PayloadAction<{ attendeeId: string, status: 0 | 1 }>) => {
        const { attendeeId, status } = action.payload;
        
        // Update in list
        state.list = state.list.map(attendee => 
          attendee.id.toString() === attendeeId.toString() 
            ? { ...attendee, attendee_status: status } 
            : attendee
        );
        
        // Update selected attendee if it's the same one
        if (state.selectedAttendee && state.selectedAttendee.theAttendeeId === attendeeId.toString()) {
          state.selectedAttendee = {
            ...state.selectedAttendee,
            attendeeStatus: status
          };
        }
        console.log('selected attendee', state.selectedAttendee);
        
        state.isUpdating = false;
      })
      .addCase(updateAttendeeStatusThunk.rejected, (state) => {
        state.isUpdating = false;
        state.error = 'Failed to update attendee status';
      })
      
      // Update field cases
      .addCase(updateAttendeeFieldThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAttendeeFieldThunk.fulfilled, (state, action: PayloadAction<{ attendeeId: string, field: string, value: string }>) => {
        const { attendeeId, field, value } = action.payload;
        
        // Update in list
        state.list = state.list.map(attendee => {
          if (attendee.id.toString() === attendeeId.toString()) {
            return {
              ...attendee,
              // Use bracket notation to update the dynamic field
              [field]: value
            };
          }
          return attendee;
        });
        
        // Update selected attendee if it's the same one
        if (state.selectedAttendee && state.selectedAttendee.theAttendeeId === attendeeId.toString()) {
          state.selectedAttendee = {
            ...state.selectedAttendee,
            // Map API field names to selectedAttendee property names
            // This mapping might need to be adjusted based on your actual field names
            ...mapFieldToSelectedAttendee(field, value)
          };
        }
        
        state.isUpdating = false;
      })
      .addCase(updateAttendeeFieldThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to update attendee field';
      })
      
      // Edit attendee cases
      .addCase(editAttendeeThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(editAttendeeThunk.fulfilled, (state, action) => {
        const updatedAttendee = action.payload;
        
        // Update in list
        state.list = state.list.map(attendee => 
          attendee.id.toString() === updatedAttendee.id.toString()
            ? { ...attendee, ...updatedAttendee }
            : attendee
        );
        
        // Update selected attendee if it's the same one
        if (state.selectedAttendee && state.selectedAttendee.theAttendeeId === updatedAttendee.id.toString()) {
          state.selectedAttendee = {
            ...state.selectedAttendee,
            firstName: updatedAttendee.first_name,
            lastName: updatedAttendee.last_name,
            email: updatedAttendee.email,
            phone: updatedAttendee.phone || '',
            organization: updatedAttendee.organization || '',
            jobTitle: updatedAttendee.job_title || '',
          };
        }
        
        state.isUpdating = false;
      })
      .addCase(editAttendeeThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to edit attendee';
      });
  },
});

export const { clearAttendees, clearSelectedAttendee, updateAttendeeLocally } = attendeeSlice.actions;
export default attendeeSlice.reducer;
