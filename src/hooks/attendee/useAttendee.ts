import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../redux/store';
import { 
  fetchAttendeesList, 
  fetchAttendeeDetails as fetchAttendeeDetailsAction,
  updateAttendeeStatusThunk,
  updateAttendeeFieldThunk,
  clearSelectedAttendee,
  fetchPartnerAttendeesListThunk,
  fetchPartnerAttendeeDetailsThunk,
  clearPartnerAttendees,
  clearSelectedPartnerAttendee
} from '../../features/attendee';
import { RootState } from '../../redux/store';
import { 
  Attendee,
  FetchAttendeesParams, 
  UpdateAttendeeStatusParams,
  UpdateAttendeeFieldParams,
  FetchPartnerAttendeesParams,
  PartnerAttendee
} from '../../features/attendee/attendee.types';

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
    loadingAttendeeId,
    isUpdating,
    error,
    // Partner attendees states
    partnerList,
    selectedPartnerAttendee,
    isLoadingPartnerList,
    isLoadingPartnerDetails,
    partnerError
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

  // Fetch partner attendees list
  const fetchPartnerAttendeesList = useCallback((params: Omit<FetchPartnerAttendeesParams, 'attendeeId'>): Promise<PartnerAttendee[]> => {
    return dispatch(fetchPartnerAttendeesListThunk(params)).unwrap();
  }, [dispatch]);

  // Fetch partner attendee details
  const fetchPartnerAttendeeDetails = useCallback((params: FetchPartnerAttendeesParams) => {
    return dispatch(fetchPartnerAttendeeDetailsThunk(params)).unwrap();
  }, [dispatch]);

  // Clear partner attendees
  const clearPartnerAttendeesList = useCallback(() => {
    dispatch(clearPartnerAttendees());
  }, [dispatch]);

  // Clear selected partner attendee
  const clearPartnerAttendee = useCallback(() => {
    dispatch(clearSelectedPartnerAttendee());
  }, [dispatch]);

  return {
    // State
    attendees: list,
    attendeeDetails: selectedAttendee,
    isLoadingList,
    isLoadingDetails,
    loadingAttendeeId,
    isUpdating,
    error,
    
    // Partner attendees state
    partnerAttendees: partnerList,
    partnerAttendeeDetails: selectedPartnerAttendee,
    isLoadingPartnerList,
    isLoadingPartnerDetails,
    partnerError,
    
    // Actions
    fetchAttendees,
    fetchAttendeeDetails,
    updateAttendeeStatus,
    updateAttendeeField,
    clearAttendee,
    
    // Partner attendees actions
    fetchPartnerAttendeesList,
    fetchPartnerAttendeeDetails,
    clearPartnerAttendeesList,
    clearPartnerAttendee
  };
};
