import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { handleApiSuccess } from '../utils/api/handleApiSuccess';
import { cleanParams } from '../utils/api/cleanParams';

export const fetchDetailsByType = async (userId, eventId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
    });

    if (__DEV__) {
      console.log('Params sent to API:', params);
    }

    const response = await axios.get(
      `${BASE_URL}/ajax_get_dashboard_attendence_by_type_chart/`,
      { params }
    );

    return handleApiSuccess(response, 'Failed to fetch attendee by type chart details');
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch attendee by type chart details');
  }
};
