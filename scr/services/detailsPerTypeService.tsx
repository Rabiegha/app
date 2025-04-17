import { handleApiError } from '../utils/api/handleApiError';
import { handleApiSuccess } from '../utils/api/handleApiSuccess';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';

export const fetchDetailsByType = async (userId, eventId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
    });

    if (__DEV__) {
      console.log('Params sent to API:', params);
    }

    const response = await mainApi.get(
      '/ajax_get_dashboard_attendence_by_type_chart/',
      { params }
    );

    return handleApiSuccess(response, 'Failed to fetch attendee by type chart details');
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch attendee by type chart details');
  }
};
