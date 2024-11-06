// src/services/eventService.js
import axios from 'axios';
import {BASE_URL, PRINT_URL, PRINT_NODE_URL} from '../config/config';
import {Buffer} from 'buffer';

const apiKey = 'PrDdPPH6bJJpWSYwONmfapRUCCkL-770o5ZTsWSyY7g';
const base64ApiKey = Buffer.from(`${apiKey}:`).toString('base64');

// Function to update attendee status

export const updateAttendee = async (userId, attendeeId, attendeeData) => {
  const url = `${BASE_URL}/ajax_update_attendee/?current_user_login_details_id=${userId}&attendee_id=${attendeeId}&first_name=${attendeeData.first_name}&last_name=${attendeeData.last_name}&email=${attendeeData.email}&phone=${attendeeData.phone}&organization=${attendeeData.organization}&designation=${attendeeData.jobTitle}`;
  return axios.post(url);
};

//Scan to update status

export const scanAttendee = async (userId, eventId, data) => {
  const apiUrl = `${BASE_URL}/ajax_join_attendee/?current_user_login_details_id=${userId}&event_id=${eventId}&content=${data}`;
  try {
    const response = await axios.post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    throw error;
  }
};

// get attendee types

export const getAttendeeTypes = async (
  currentUserLoginDetailsId,
  attendeeTypeId = null,
) => {
  try {
    const params = {
      current_user_login_details_id: currentUserLoginDetailsId,
    };
    if (attendeeTypeId) {
      params.attendee_type_id = attendeeTypeId;
    }
    const response = await axios.get(
      `${BASE_URL}/ajax_get_attendee_type_details`,
      {params},
    );

    //Check if the status  is true

    if (response.data.status) {
      return response.data.data;
    } else {
      throw new Error('API returned false status');
    }
  } catch (error) {
    console.error('Error fetching attendee type details:', error);
    throw error;
  }
};

//add a new attendee

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
    const url = `${BASE_URL}/add_attendee/?ems_secret_code=${ems_secret_code}&salutation=${salutation}&first_name=${first_name}&last_name=${last_name}&email=${email}&phone=${phone}&organization=${organization}&designation=${jobTitle}&attendee_status=${attendee_status}&status_id=${status_id}&attendee_type_id=${attendee_type_id}`;

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

// Edit attendee

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
    const url = `${BASE_URL}/ajax_update_attendee/?current_user_login_details_id=${userId}&attendee_id=${attendeeId}&first_name=${first_name}&last_name=${last_name}&email=${email}&phone=${phone}&organization=${organization}&designation=${jobTitle}&attendee_type_id=${typeId}`;

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

// Attendees list

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

// REGISTRATION SUMMARY DETAILS

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

// ATTENDENCE BY TYPE CHART DETAILS

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

//Get events list

export const fetchEventDetails = async (userId, isEventFrom) => {
  const url = `${BASE_URL}/ajax_get_event_details/?current_user_login_details_id=${userId}&is_event_from=${isEventFrom}`;

  try {
    const response = await axios.get(url);
    if (response.data.status && response.data.event_details) {
      return response.data;
    } else {
      console.log('Events list not fetched');
      throw new Error('Events list not fetched');
    }
  } catch (error) {
    console.log('Error fetching events list from past', error);
    throw error;
  }
};

//*************************$$$$$$$$$$$**************$$$$$$$$$$$$$********************$$$$$$$$$$$$$$$$$$*****************/

// Fetch Wi-Fi printers
export const getWifiPrinters = () => {
  return axios
    .get(`${PRINT_URL}/printers`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching Wi-Fi printers:', error);
      throw error;
    });
};

// Fetch Bluetooth printers
export const getBluetoothPrinters = () => {
  return axios
    .get(`${PRINT_URL}/bluetooth`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching Bluetooth printers:', error);
      throw error;
    });
};

export const getPrinterImage = printerModel => {
  return axios
    .get(`http://your-image-api.com/getImage?model=${printerModel}`)
    .then(response => response.data.imageUrl)
    .catch(error => {
      console.error('Error fetching image for model:', printerModel, error);
      return 'default-image-url'; // fallback if no image found
    });
};

// PrintNode printing

const printNodeInstance = axios.create({
  baseURL: PRINT_NODE_URL,
  headers: {
    Authorization: `Basic ${base64ApiKey}`, // Basic Authentication Header
    'Content-Type': 'application/json',
  },
});

// get printers

export const getNodePrinters = async () => {
  try {
    const response = await printNodeInstance.get('/printers');
    /*     console.log('Printers:', response.data); */
    return response.data;
  } catch (error) {
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened while setting up the request
      console.error('Error', error.message);
    }
  }
};

// send print job

export const sendPrintJob = async (printerId, fileType, fileBase64) => {
  try {
    const data = {
      printerId: printerId,
      title: 'Print Job From Attendee',
      contentType: fileType,
      content: fileBase64,
      source: 'Attendee App',
    };
    const response = await printNodeInstance.post('/printjobs', data);
    return response.data;
  } catch (error) {
    console.error('Error sending print job:', error);
    throw error;
  }
};
