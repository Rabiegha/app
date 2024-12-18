import axios from 'axios';
import {BASE_URL} from '../config/config';

export const scanAttendee = async (userId, eventId, data) => {
  const apiUrl = `${BASE_URL}/ajax_join_attendee/?current_user_login_details_id=${userId}&event_id=${eventId}&content=${data}`;
  try {
    const response = await axios.post(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    throw error;
  }
};
