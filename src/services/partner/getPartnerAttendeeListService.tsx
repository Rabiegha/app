import { handleApiError } from '../../utils/api/handleApiError';
import { cleanParams } from '../../utils/api/cleanParams';
import mainApi from '../../config/mainApi';
import { Attendee } from '../../types/attendee.types';

interface PartnerAttendeeResponse {
  status: boolean;
  data: Attendee[];
}

export const fetchPartnerAttendeesList = async (
    userId: string,
    eventId: string,
  ): Promise<Attendee[]> => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
    });

    console.log('Params sent to API:', params);

    const response = await mainApi.get<PartnerAttendeeResponse>(
      '/ajax_get_event_partner_attendee_details/',
      { params }
    );
    
    console.log('Full API response:', response.data);

    if (!response.data || !response.data.status || !response.data.data) {
      throw new Error('Event attendee list not fetched');
    }

    console.log('Attendee list fetched successfully, count:', response.data.data.length);
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch event attendee list');
    return []; // fallback for component usage
  }
};
