import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';
import { Attendee } from '../types/attendee.types';

export const fetchAttendeesList = async (
    userId: string,
    eventId: string,
    attendeeId?: string,
    attendeeStatus?: number
  ): Promise<Attendee[]> => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
    });


    if (attendeeStatus){
      params.attendee_status = attendeeStatus;
    }

    const response = await mainApi.get(
      '/ajax_get_event_attendee_details/',
      { params }
    );
    console.log('Params sent to API:', params);


    if (!response.data || !response.data.event_attendee_details) {
      console.log('Full API response:', response.data);
      throw new Error('Event attendee list not fetched');
    }
    return response.data.event_attendee_details;
  } catch (error) {
    handleApiError(error, 'Failed to fetch event attendee list');
    return []; // fallback si utilisé dans un composant
  }
};
