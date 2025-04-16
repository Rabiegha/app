import axios from 'axios';
import { BASE_URL } from '../config/config';
import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';

export const addAttendee = async (attendeeData) => {
  try {
    // Champs obligatoires
    const {
      current_user_login_details_id,
      ems_secret_code,
    } = attendeeData;

    if (!current_user_login_details_id || !ems_secret_code) {
      throw new Error('Missing required fields: user ID or secret code');
    }

    // Tous les paramètres
    const params = {
      current_user_login_details_id,
      ems_secret_code,
      attendee_type_id: attendeeData.attendee_type_id,
      salutation: attendeeData.salutation,
      first_name: attendeeData.first_name,
      last_name: attendeeData.last_name,
      email: attendeeData.email,
      phone: attendeeData.phone,
      organization: attendeeData.organization,
      designation: attendeeData.jobTitle,
      postal_address: attendeeData.postal_address,
      status_id: attendeeData.status_id,
      attendee_status: attendeeData.attendee_status,

      // Options supplémentaires
      send_confirmation_mail_ems_yn: 0,
      generate_qrcode: 0,
      generate_badge: 1,
      send_badge_yn: 0,
      send_badge_item: '',
    };

    const response = await axios.post(
      `${BASE_URL}/add_attendee/`,
      null,
      { params: cleanParams(params) }
    );

    if (!response.data || !response.data.status) {
      console.log('Params sent to API:', cleanParams(params));
      console.log('Full API response:', response.data);
      throw new Error(response.data?.message || 'API returned false status while adding attendee');
    }

    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to add attendee');
  }
};

