// src/services/eventService.js
import axios from 'axios';
import { BASE_URL } from '../config/config';

// Function to update attendee status
export const updateAttendeeStatus = async (eventId, attendeeId, status) {
    const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${eventId}&attendee_id=${attendeeId}&attendee_status=${status}`;
  try {
    const response = await axios.post(url);
    return response.data;  // Return the response data for further processing
  } catch (error) {
    console.error('Error updating attendee status:', error);
    throw error;  // Rethrow to handle it in the calling component
  }
};

export const updateAttendee = async (userId, attendeeId, attendeeData) => {
  const url = `${BASE_URL}/ajax_update_attendee/?current_user_login_details_id=${userId}&attendee_id=${attendeeId}&first_name=${attendeeData.first_name}&last_name=${attendeeData.last_name}&email=${attendeeData.email}&phone=${attendeeData.phone}&organization=${attendeeData.organization}&designation=${attendeeData.jobTitle}`;
  return axios.post(url);
};