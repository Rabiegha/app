import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';

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

    const response = await axios.post(
      `${BASE_URL}/ajax_update_attendee/`,
      null,
      { params }
    );

    if (!response.data || !response.data.status) {
      console.log('Params sent to API:', params);
      console.log('Full API response:', response.data);
      throw new Error(response.data?.message || 'API returned false status while editing attendee');
    }

    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to edit attendee');
  }
};
