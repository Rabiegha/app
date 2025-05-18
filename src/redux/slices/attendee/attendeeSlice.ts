import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Attendee, 
  AttendeeDetails,
  FetchAttendeesParams,
  UpdateAttendeeStatusParams,
  UpdateAttendeeFieldParams
} from '../../../types/attendee.types';
import { 
  fetchAttendees, 
  updateAttendeeStatus, 
  updateAttendeeField,
  mapAttendeeToDetails
} from '../../../services/attendeeService';

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
    case 'comment':
      return { commentaire: value };
    default:
      // Return an empty object if the field doesn't map to any property
      return {};
  }
};

// State type
interface AttendeeState {
  list: Attendee[];
  selectedAttendee: AttendeeDetails | null;
  isLoadingList: boolean;
  isLoadingDetails: boolean;
  isUpdating: boolean;
  error: string | null;
}

// Initial state
const initialState: AttendeeState = {
  list: [],
  selectedAttendee: null,
  isLoadingList: false,
  isLoadingDetails: false,
  isUpdating: false,
  error: null,
};

// Thunks
export const fetchAttendeesList = createAsyncThunk(
  'attendees/fetchList',
  async (params: FetchAttendeesParams) => {
    return await fetchAttendees(params);
  }
);

export const fetchAttendeeDetails = createAsyncThunk(
  'attendees/fetchDetails',
  async (params: FetchAttendeesParams) => {
    const attendees = await fetchAttendees(params);
    if (attendees.length > 0) {
      return mapAttendeeToDetails(attendees[0]);
    }
    throw new Error('Attendee not found');
  }
);

export const updateAttendeeStatusThunk = createAsyncThunk(
  'attendees/updateStatus',
  async (params: UpdateAttendeeStatusParams, { rejectWithValue }) => {
    try {
      const success = await updateAttendeeStatus(params);
      if (success) {
        return { attendeeId: params.attendeeId, status: params.status };
      }
      return rejectWithValue('Update failed');
    } catch (error) {
      return rejectWithValue('Update failed');
    }
  }
);

export const updateAttendeeFieldThunk = createAsyncThunk(
  'attendees/updateField',
  async (params: UpdateAttendeeFieldParams, { rejectWithValue }) => {
    try {
      // Use the updateAttendeeField from attendeeService.ts
      const success = await updateAttendeeField(params);
      if (success) {
        return { attendeeId: params.attendeeId, field: params.field, value: params.value };
      }
      return rejectWithValue('Field update failed');
    } catch (error) {
      // Provide more detailed error message if available
      const errorMessage = error instanceof Error ? error.message : 'Field update failed';
      return rejectWithValue(errorMessage);
    }
  }
);

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
      state.selectedAttendee = null;
    },

    updateAttendeeLocally(state, action) {
        const updated = action.payload;
        state.list = state.list.map(attendee =>
          attendee.id === updated.id ? updated : attendee
        );
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
      .addCase(fetchAttendeeDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(fetchAttendeeDetails.fulfilled, (state, action) => {
        state.selectedAttendee = action.payload;
        state.isLoadingDetails = false;
      })
      .addCase(fetchAttendeeDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.error.message || 'Failed to fetch attendee details';
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
      });
  },
});

export const { clearAttendees, clearSelectedAttendee, updateAttendeeLocally } = attendeeSlice.actions;
export default attendeeSlice.reducer;
