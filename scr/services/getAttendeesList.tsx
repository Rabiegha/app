import axios from 'axios';
import {BASE_URL} from '../config/config';

export const fetchEventAttendeeList = async (userId, eventId) => {
  const url = `${BASE_URL}/ajax_get_event_attendee_details/?current_user_login_details_id=${userId}&event_id=${eventId}&attendee_status=0&status_id=`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.event_attendee_details) {
      console.log('list fetched succesfully');
      return response.data.event_attendee_details;
    } else {
      console.log('list not fetched');
    }
  } catch (error) {
    console.error('Error fetching data from server, using local data:', error);
  }
};
