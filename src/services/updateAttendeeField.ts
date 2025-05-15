// services/attendee/updateAttendeeField.ts
import { cleanParams } from '../utils/api/cleanParams';
import { handleApiError } from '../utils/api/handleApiError';
import { handleApiSuccess } from '../utils/api/handleApiSuccess';
import mainApi from '../config/mainApi';

export const updateAttendeeField = async ({
  userId,
  attendeeId,
  field,
  value,
}: {
  userId: string;
  attendeeId: string;
  field: string;
  value: string;
}) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      attendee_id: attendeeId,
      [field]: value,
    });

    if (__DEV__) {
      console.log('Sending param:', params);
    }

    const response = await mainApi.post('/ajax_update_attendee/', null, { params });
    return handleApiSuccess(response, 'Failed to update attendee');
  } catch (error) {
    throw handleApiError(error, 'Update attendee error');
  }
};
