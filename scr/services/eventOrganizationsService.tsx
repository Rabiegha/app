// services/eventOrganizationsService.js

import axios from 'axios';
import {BASE_URL} from '../config/config';

export const fetchEventOrganizations = async (userId, eventId) => {
  const url = `${BASE_URL}/ajax_get_event_attendee_distinct_organization/?current_user_login_details_id=${userId}&event_id=${eventId}`;

  try {
    const response = await axios.get(url);
    const serverData = response.data;
    if (response.data) {
      console.log('Distinct organizations fetched successfully');
      return serverData.data;
    } else {
      console.log('Distinct organizations not fetched');

      return []; // Return empty array if none
    }
  } catch (error) {
    console.error('Error fetching data from server:', error);
    throw error; // Throw so the hook can catch it
  }
};
