import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';

export const fetchEventOrganizations = async (userId, eventId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
    });

    const response = await axios.get(
      `${BASE_URL}/ajax_get_event_attendee_distinct_organization/`,
      { params }
    );

    const serverData = response.data;

    if (!serverData || !serverData.status || !serverData.data) {
      console.log('Distinct organizations not fetched');
      return [];
    }

    console.log('Distinct organizations fetched successfully');
    return serverData.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch event organizations');
    return []; // Fallback en cas d'erreur
  }
};
