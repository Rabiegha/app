import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { handleApiSuccess } from '../utils/api/handleApiSuccess';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';

export const editAttendee = async (attendeeData) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: attendeeData.userId,
      attendee_id: attendeeData.attendeeId,
      first_name: attendeeData.first_name,
      last_name: attendeeData.last_name,
      email: attendeeData.email,
      phone: attendeeData.phone,
      organization: attendeeData.organization,
      designation: attendeeData.jobTitle,
      attendee_type_id: attendeeData.typeId,
      generate_badge: 1,
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
