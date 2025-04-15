import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';

export const getSessionsList = async (currentUserLoginDetailsId, eventId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: currentUserLoginDetailsId,
      event_id: eventId,
    });

    const response = await axios.get(
      `${BASE_URL}/ajax_get_event_child_details`,
      { params }
    );

    if (!response.data || !response.data.status) {
      console.log('Full API response:', response.data);
      throw new Error(response.data?.message || 'API returned false status while fetching sessions');
    }

    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch sessions list');
  }
};
