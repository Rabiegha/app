import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import { handleApiSuccess } from '../utils/api/handleApiSuccess';
import mainApi from '../config/mainApi';

export const getSessionsList = async (currentUserLoginDetailsId: string | null, eventId: string | null) => {
  // Validate required parameters before making the API call
  if (!currentUserLoginDetailsId) {
    throw new Error('No user is currently logged in');
  }
  
  if (!eventId) {
    throw new Error('No event selected');
  }
  
  try {
    const params = cleanParams({
      current_user_login_details_id: currentUserLoginDetailsId,
      event_id: eventId,
    });

    const response = await mainApi.get(
      '/ajax_get_event_child_details',
      { params }
    );

    return(handleApiSuccess(response, 'Failed to fetch sessions list'));
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch sessions list');
  }
};
