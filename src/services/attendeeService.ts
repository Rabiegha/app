import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';
import { BASE_URL } from '../config/config';
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
    // Validate required parameters
    if (!userId) {
      console.warn('Missing userId in fetchAttendees');
    }
    if (!eventId) {
      console.warn('Missing eventId in fetchAttendees');
    }
    if (!attendeeId) {
      console.warn('Missing attendeeId in fetchAttendees');
    }

    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
      attendee_status: attendeeStatus
    });
    
    console.log('Params sent to API:', params);
    console.log('Full API URL:', `${BASE_URL}/ajax_get_event_attendee_details/?current_user_login_details_id=${userId}&event_id=${eventId}&attendee_id=${attendeeId}`);

    // Add a timeout to ensure the request doesn't hang
    const response = await mainApi.get('/ajax_get_event_attendee_details/', { 
      params,
      timeout: 10000 // 10 second timeout
    });

    if (!response.data) {
      console.error('No data received from API');
      return [];
    }

    if (!response.data.event_attendee_details) {
      console.error('No event_attendee_details in response');
      return [];
    }

    if (!Array.isArray(response.data.event_attendee_details)) {
      console.error('event_attendee_details is not an array');
      return [];
    }

    if (response.data.event_attendee_details.length === 0) {
      console.warn('Empty attendee list returned');
    } else {
      console.log('Attendee list received from API:', response.data.event_attendee_details);
    }

    return response.data.event_attendee_details;
  } catch (error) {
    console.error('Error in fetchAttendees:', error);
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

    // Try sending parameters in the request body instead of as query parameters
    const response = await mainApi.post(
      '/update_event_attendee_attendee_status/',
      params  // Send params as the request body
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
      '/ajax_update_attendee/',
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
  // Use the nice formatted date if available, otherwise format the raw date
  let formattedDate = '-';
  if (attendee.attendee_status === '1') {
    if (attendee.nice_attendee_status_change_datetime && 
        attendee.nice_attendee_status_change_datetime !== '-') {
      // Clean up the format from API which has escaped slashes and extra spaces
      // Example: "18\/05\/2025 02:57 AM" -> "18/05/2025 02:57 AM"
      let cleanedDate = attendee.nice_attendee_status_change_datetime;
      
      // Replace escaped slashes with normal slashes
      cleanedDate = cleanedDate.split('\/').join('/');
      
      // Fix any extra spaces
      cleanedDate = cleanedDate.trim();
      
      // Use the cleaned date
      formattedDate = cleanedDate;
    } else if (attendee.attendee_status_change_datetime) {
      try {
        // Only try to parse if it's not the default "0000-00-00 00:00:00" format
        if (attendee.attendee_status_change_datetime !== '0000-00-00 00:00:00') {
          const date = new Date(attendee.attendee_status_change_datetime);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('fr-FR');
          }
        }
      } catch (e) {
        console.warn('Error formatting date:', e);
      }
    }
  }

  // Ensure attendeeStatus is strictly 0 or 1
  const attendeeStatus: 0 | 1 = attendee.attendee_status === 1 ? 1 : 0;
  
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
    attendeeStatusChangeDatetime: formattedDate,
    attendeeStatus,
    urlBadgePdf: attendee.badge_pdf_url || '-',
    urlBadgeImage: attendee.badge_image_url || '-',
  };
};
