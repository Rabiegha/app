import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';

export const scanAttendee = async (userId, eventId, data) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      content: data,
    });

    const response = await mainApi.post(
      '/ajax_join_attendee/',
      null,
      { params }
    );

    if (!response.data || response.data.status === false) {
      console.log('Full API response:', response.data);
      throw new Error(response.data?.message || 'Scan failed');
    }

    return response.data;
  } catch (error) {
    handleApiError(error, 'Error during attendee scan');
    throw error; // en cas de gestion spécifique dans le composant appelant
  }
};
