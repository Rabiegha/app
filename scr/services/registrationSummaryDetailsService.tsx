import axios from 'axios';
import {BASE_URL} from '../config/config';

export const registrationSummaryDetails = async (userId, eventId) => {
  const url = `${BASE_URL}/ajax_get_dashboard_registration_summary/?current_user_login_details_id=${userId}&event_id=${eventId}`;

  try {
    const response = await axios.get(url);
    if (response.data) {
      console.log('Registration summary details fetched sucefully');
      return response.data;
    } else {
      console.log('Registration summary details not fetched');
    }
  } catch (error) {
    console.error('Error fetching data from server, using local data:', error);
  }
};
