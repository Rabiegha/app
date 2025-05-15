// src/services/eventService.ts
import axios from 'axios';
import {PRINT_URL} from '../config/config';

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
