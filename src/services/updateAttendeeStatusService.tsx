import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';

import { UpdateAttendeeStatusParams } from '@/types/attendee.types';

export const updateAttendeeStatus = async (updatedAttendee: UpdateAttendeeStatusParams, userId: string) => {                    
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: updatedAttendee.eventId,
      attendee_id: updatedAttendee.attendeeId,
      attendee_status: updatedAttendee.status,
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
