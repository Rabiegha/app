import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../redux/store';
import { 
  fetchAttendeesList, 
  fetchAttendeeDetails as fetchAttendeeDetailsAction,
  updateAttendeeStatusThunk,
  updateAttendeeFieldThunk,
  clearSelectedAttendee
} from '../../redux/slices/attendee/attendeeSlice';
import { RootState } from '../../redux/store';
import { 
  Attendee,
  FetchAttendeesParams, 
  UpdateAttendeeStatusParams,
  UpdateAttendeeFieldParams
} from '../../types/attendee.types';

/**
 * Custom hook for working with attendee data
 */
export const useAttendee = () => {
  const dispatch = useAppDispatch();
  
  // Select state from Redux
  const { 
    list, 
    selectedAttendee, 
    isLoadingList,
    isLoadingDetails,
    isUpdating,
    error 
  } = useSelector((state: RootState) => state.attendee);

  // Fetch attendees list
  const fetchAttendees = useCallback((params: FetchAttendeesParams): Promise<Attendee[]> => {
    return dispatch(fetchAttendeesList(params)).unwrap();
  }, [dispatch]);

  // Fetch single attendee details
  const fetchAttendeeDetails = useCallback((params: FetchAttendeesParams) => {
    return dispatch(fetchAttendeeDetailsAction(params)).unwrap();
  }, [dispatch]);

  // Update attendee status (check-in/check-out)
  const updateAttendeeStatus = useCallback((params: UpdateAttendeeStatusParams) => {
    return dispatch(updateAttendeeStatusThunk(params)).unwrap();
  }, [dispatch]);

  // Update attendee field
  const updateAttendeeField = useCallback((params: UpdateAttendeeFieldParams) => {
    return dispatch(updateAttendeeFieldThunk(params)).unwrap();
  }, [dispatch]);

  // Clear selected attendee
  const clearAttendee = useCallback(() => {
    dispatch(clearSelectedAttendee());
  }, [dispatch]);

  return {
    // State
    attendees: list,
    attendeeDetails: selectedAttendee,
    isLoadingList,
    isLoadingDetails,
    isUpdating,
    error,
    
    // Actions
    fetchAttendees,
    fetchAttendeeDetails,
    updateAttendeeStatus,
    updateAttendeeField,
    clearAttendee
  };
};
