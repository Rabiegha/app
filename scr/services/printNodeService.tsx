// src/services/eventService.js
import axios from 'axios';
import {PRINT_NODE_URL} from '../config/config';

const apiKey = 'PrDdPPH6bJJpWSYwONmfapRUCCkL-770o5ZTsWSyY7g';
const base64ApiKey = Buffer.from(`${apiKey}:`).toString('base64');

const printNodeInstance = axios.create({
  baseURL: PRINT_NODE_URL,
  headers: {
    Authorization: `Basic ${base64ApiKey}`,
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

// Send node print job

export const sendPrintJob = async printJob => {
  try {
    const response = await printNodeInstance.post('/printjobs', printJob);
    return response.data;
  } catch (error) {
    console.error('Error sending print job:', error);
    throw error;
  }
};
