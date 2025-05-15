import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import mainApi from '../config/mainApi';
import { Attendee } from '../types/attendee.types';

export const fetchAttendeeCounts = async (
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
      throw new Error('Attendee count not fetched');
    }

    console.log('Attendee count fetched successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch attendee count');
    return []; // fallback si utilisé dans un composant
  }
};
