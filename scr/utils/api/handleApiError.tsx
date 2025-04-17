import { TOAST_MESSAGES } from '../../constants/toastMessages';
import { showToast } from '../ui/toastUtils';

export const handleApiError = (error, customMessage = TOAST_MESSAGES.errors.generic) => {
  let finalMessage = TOAST_MESSAGES.errors.generic;

  if (error.code === 'ECONNABORTED') {
    finalMessage = TOAST_MESSAGES.errors.timeout;
  } else if (error.response) {
    console.error(`${customMessage} - Server error:`, error.response);
    finalMessage = TOAST_MESSAGES.errors.serverError(error.response.status);
  } else if (error.request) {
    console.error(`${customMessage} - No response received:`, error.request);
    finalMessage = TOAST_MESSAGES.errors.noResponse;
  } else {
    console.error(`${customMessage} - Unexpected error:`, error.message);
    finalMessage = TOAST_MESSAGES.errors.custom(error.message);
  }

  // ✅ Show toast and return a JS Error
  showToast('customError' ,'Erreur', finalMessage);
  return new Error(finalMessage);
};
