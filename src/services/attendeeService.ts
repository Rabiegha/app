import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';
import { 
  Attendee, 
  FetchAttendeesParams, 
  UpdateAttendeeStatusParams,
  UpdateAttendeeFieldParams
} from '../types/attendee.types';

/**
 * Fetch attendees list with optional filtering
 */
export const fetchAttendees = async ({
  userId,
  eventId,
  attendeeId,
  attendeeStatus
}: FetchAttendeesParams): Promise<Attendee[]> => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
      attendee_status: attendeeStatus
    });
    if (__DEV__) {
        console.log('Params sent to API:', params);
      }

    const response = await mainApi.get('/ajax_get_event_attendee_details/', { params });

    if (!response.data || !response.data.event_attendee_details) {
      throw new Error('Event attendee list not fetched');
    }

    console.log('Attendee list fetched successfully');


    return response.data.event_attendee_details;
  } catch (error) {
    handleApiError(error, 'Failed to fetch event attendee list');
    return []; 
  }
};

/**
 * Update attendee status (check-in/check-out)
 */
export const updateAttendeeStatus = async ({
  userId,
  eventId,
  attendeeId,
  status
}: UpdateAttendeeStatusParams): Promise<boolean> => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
      attendee_status: status,
    });

    const response = await mainApi.post(
      '/update_event_attendee_attendee_status/',
      null,
      { params }
    );

    if (__DEV__) {
        console.log('Params sent to API:', params);
      }

    return response.data?.status === true;
  } catch (error) {
    handleApiError(error, 'Failed to update attendee status');
    throw error;
  }
};

/**
 * Update a specific field for an attendee
 */
export const updateAttendeeField = async ({
  userId,
  attendeeId,
  field,
  value
}: UpdateAttendeeFieldParams): Promise<boolean> => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      attendee_id: attendeeId,
      [field]: value
    });

    const response = await mainApi.post(
      '/update_event_attendee_field/',
      null,
      { params }
    );

    if (__DEV__) {
        console.log('Params sent to API:', params);
      }

    return response.data?.status === true;
  } catch (error) {
    handleApiError(error, 'Failed to update attendee field');
    throw error;
  }
};

/**
 * Map API attendee data to frontend display format
 */
export const mapAttendeeToDetails = (attendee: Attendee) => {
  return {
    type: attendee.attendee_type_name || '-',
    lastName: attendee.last_name || '-',
    firstName: attendee.first_name || '-',
    email: attendee.email || '-',
    phone: attendee.phone || '-',
    organization: attendee.organization || '-',
    jobTitle: attendee.designation || '-',
    theAttendeeId: String(attendee.id) || '-',
    commentaire: attendee.comment || '-',
    attendeeStatusChangeDatetime: attendee.nice_attendee_status_change_datetime || '-',
    attendeeStatus: attendee.attendee_status === 1 ? 1 : 0,
    urlBadgePdf: attendee.badge_pdf_url || '-',
  };
};
