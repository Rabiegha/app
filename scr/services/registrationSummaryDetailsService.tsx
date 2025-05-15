import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';

export const registrationSummaryDetails = async (userId, eventId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
    });

    const response = await mainApi.get(
      '/ajax_get_dashboard_registration_summary/',
      { params }
    );

    if (!response.data || response.data.status === false) {
      console.log('Full API response:', response.data);
      throw new Error(response.data?.message || 'Registration summary details not fetched');
    }

    console.log('Registration summary details fetched successfully for user:', userId);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch registration summary details');
    return null; // fallback si utilisé dans un composant
  }
};
