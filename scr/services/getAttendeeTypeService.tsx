import axios from 'axios';
import {BASE_URL} from '../config/config';

export const getAttendeeTypes = async (
  currentUserLoginDetailsId,
  attendeeTypeId = null,
) => {
  try {
    const params = {
      current_user_login_details_id: currentUserLoginDetailsId,
    };
    if (attendeeTypeId) {
      params.attendee_type_id = attendeeTypeId;
    }
    const response = await axios.get(
      `${BASE_URL}/ajax_get_attendee_type_details`,
      {params},
    );

    //Check if the status  is true

    if (response.data.status) {
      return response.data.data;
    } else {
      throw new Error('API returned false status');
    }
  } catch (error) {
    console.error('Error fetching attendee type details:', error);
    throw error;
  }
};
