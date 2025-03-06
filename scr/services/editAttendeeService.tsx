import axios from 'axios';
import {BASE_URL} from '../config/config';

export const editAttendee = async attendeeData => {
  const {
    userId,
    attendeeId,
    first_name,
    last_name,
    email,
    phone,
    organization,
    jobTitle,
    typeId,
  } = attendeeData;

  try {
    const url = `${BASE_URL}/ajax_update_attendee/?current_user_login_details_id=${userId}&attendee_id=${attendeeId}&first_name=${first_name}&last_name=${last_name}&email=${email}&phone=${phone}&organization=${organization}&designation=${jobTitle}&attendee_type_id=${typeId}&generate_badge=1`;

    const response = await axios.post(url);

    if (response.data.status) {
      return response.data;
    } else {
      throw new Error('Erreur lors de l’ajout de l’attendee.');
    }
  } catch (error) {
    console.error('Erreur lors de l’ajout de l’attendee:', error);
    throw error;
  }
};
