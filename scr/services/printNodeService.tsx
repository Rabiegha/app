import printNode from '../config/printNodeApi';
import { handleApiError } from '../utils/api/handleApiError';

// Get printers

export const getNodePrinters = async () => {
  try {
    const response = await printNode.get('/printers');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch printers');
  }
};


// Send print job
export const sendPrintJob = async (printJob) => {
  try {
    const response = await printNode.post('/printjobs', printJob);
    return response.data;
  } catch (error) {
    console.error('Error sending print job:', error);
    throw error;
  }
};
