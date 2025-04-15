import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';

export const getAttendeeTypes = async (
  currentUserLoginDetailsId,
  attendeeTypeId = null,
) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: currentUserLoginDetailsId,
      attendee_type_id: attendeeTypeId,
    });

    const response = await axios.get(
      `${BASE_URL}/ajax_get_attendee_type_details`,
      { params }
    );

    if (!response.data || !response.data.status) {
      console.log('Full API response:', response.data);
      throw new Error(response.data?.message || 'API returned false status');
    }

    return response.data.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch attendee types');
  }
};
