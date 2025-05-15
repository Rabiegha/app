import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';

export const fetchEventOrganizations = async (userId, eventId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
    });

    const response = await mainApi.get(
      '/ajax_get_event_attendee_distinct_organization/',
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
