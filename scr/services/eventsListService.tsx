import axios from 'axios';
import {BASE_URL} from '../config/config';

export const fetchEventList = async (userId, isEventFrom) => {
  const url = `${BASE_URL}/ajax_get_event_details/?current_user_login_details_id=${userId}&is_event_from=${isEventFrom}`;

  try {
    const response = await axios.get(url);
    if (response.data.status && response.data.event_details) {
      return response.data;
    } else {
      /* console.log('Events list not fetched'); */
      return [];
    }
  } catch (error) {
    console.log('Error fetching events list from past', error);
    throw error;
  }
};
