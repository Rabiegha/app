import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';

export const fetchEventAttendeeList = async (userId, eventId, attendeeId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
    });

    const response = await axios.get(
      `${BASE_URL}/ajax_get_event_attendee_details/`,
      { params }
    );

    if (!response.data || !response.data.event_attendee_details) {
      console.log('Full API response:', response.data);
      throw new Error('Event attendee list not fetched');
    }

    console.log('Attendee list fetched successfully');
    return response.data.event_attendee_details;
  } catch (error) {
    handleApiError(error, 'Failed to fetch event attendee list');
    return []; // fallback si utilisé dans un composant
  }
};
