import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';

export const fetchDetailsByType = async (userId, eventId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
    });

    const response = await axios.get(
      `${BASE_URL}/ajax_get_dashboard_attendence_by_type_chart/`,
      { params }
    );

    if (!response.data || !response.data.status) {
      console.log('Params sent to API:', params);
      console.log('Full API response:', response.data);
      throw new Error(response.data?.message || 'API returned false status');
    }

    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch attendee by type chart details');
  }
};
