import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';

export const updateAttendeeStatus = async (updatedAttendee, userId) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: updatedAttendee.event_id,
      attendee_id: updatedAttendee.id,
      attendee_status: updatedAttendee.attendee_status,
    });

    await mainApi.post(
      '/update_event_attendee_attendee_status/',
      null,
      { params }
    );

    return updatedAttendee;
  } catch (error) {
    handleApiError(error, 'Failed to update attendee status');
    throw error;
  }
};
