import { handleApiError } from '../utils/api/handleApiError';
import { cleanParams } from '../utils/api/cleanParams';
import { handleApiSuccess } from '../utils/api/handleApiSuccess';
import mainApi from '../config/mainApi';

interface AttendeeData {
  current_user_login_details_id: string | number;
  ems_secret_code: string;
  attendee_type_id?: string | number;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  postal_address?: string;
  status_id?: string | number;
  attendee_status?: string | number;
}

export const addAttendee = async (attendeeData: AttendeeData) => {
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
    const params = cleanParams({
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
    });

    if (__DEV__) {
      console.log('Params sent to API:', params);
    }

    const response = await mainApi.post(
      '/add_attendee/',
      null,
      { params: params }
    );

    return handleApiSuccess(response, 'Failed to add attendee');
  } catch (error) {
    handleApiError(error, 'Failed to add attendee');
  }
};

