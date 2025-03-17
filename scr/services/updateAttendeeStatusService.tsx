import axios from 'axios';
import {BASE_URL} from '../config/config';

export const updateAttendeeStatus = async (updatedAttendee, userId) => {
    const url = `${BASE_URL}/update_event_attendee_attendee_status/?current_user_login_details_id=${userId}&event_id=${updatedAttendee.event_id}&attendee_id=${updatedAttendee.id}&attendee_status=${updatedAttendee.attendee_status}`;
    try {
    await axios.post(url);
    return updatedAttendee;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    throw error;
  }
};
