import { BASE_URL } from '../../config/config';
import { handleApiError } from '../../utils/api/handleApiError';
import { handleApiSuccess } from '../../utils/api/handleApiSuccess';
import { cleanParams } from '../../utils/api/cleanParams';
import mainApi from '../../config/mainApi';

export const addComment = async (userId, attendeeId, comment) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      attendee_id: attendeeId,
      comment: comment,
    });

    if (__DEV__) {
      console.log('Params sent to API:', params);
    }

    const response = await mainApi.post(
      '/ajax_update_attendee/',
      null,
      { params }
    );

    return handleApiSuccess(response, 'Failed to edit attendee');
  } catch (error) {
    throw handleApiError(error, 'Failed to edit attendee');
  }
};
