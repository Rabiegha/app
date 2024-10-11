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

export const scanAttendee = async (eventId, data) => {
  const apiUrl = `${BASE_URL}/ajax_join_attendee/?event_id=${eventId}&content=${data}`;
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
  } = attendeeData;
  try {
    const url = `${BASE_URL}/add_attendee/?ems_secret_code=${ems_secret_code}&salutation=${salutation}&first_name=${first_name}&last_name=${last_name}&email=${email}&phone=${phone}&organization=${organization}&designation=${jobTitle}&attendee_status=${attendee_status}&status_id=${status_id}`;

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
