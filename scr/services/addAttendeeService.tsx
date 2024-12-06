import axios from 'axios';
import {BASE_URL} from '../config/config';

export const addAttendee = async attendeeData => {
  const {
    ems_secret_code,
    salutation,
    first_name,
    last_name,
    email,
    phone,
    organization,
    jobTitle,
    attendee_status,
    status_id,
    attendee_type_id,
  } = attendeeData;
  try {
    const url = `${BASE_URL}/add_attendee/?ems_secret_code=${ems_secret_code}&salutation=${salutation}&first_name=${first_name}&last_name=${last_name}&email=${email}&phone=${phone}&organization=${organization}&designation=${jobTitle}&attendee_status=${attendee_status}&status_id=${status_id}&attendee_type_id=${attendee_type_id}&generate_badge=1`;

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
