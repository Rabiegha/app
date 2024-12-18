import axios from 'axios';
import {BASE_URL} from '../config/config';

export const fetchDetailsByType = async (userId, eventId) => {
  const url = `${BASE_URL}/ajax_get_dashboard_attendence_by_type_chart/?current_user_login_details_id=${userId}&event_id=${eventId}`;

  try {
    const response = await axios.get(url);
    if (response.status) {
      return response.data;
    } else {
      console.error('Attendee by type chart details not fetched');
    }
  } catch (err) {
    console.log('Error fetching attendee by type chart detail', err);
  }
};
