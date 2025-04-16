import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import { handleApiSuccess } from '../utils/api/handleApiSuccess';

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

    return(handleApiSuccess(response, 'Failed to fetch sessions list'));
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch sessions list');
  }
};
