import { TOAST_MESSAGES } from '../../constants/toastMessages';
import { showToast } from '../ui/toastUtils';

export const handleApiError = (error: any, customMessage = TOAST_MESSAGES.errors.generic) => {
  let finalMessage = TOAST_MESSAGES.errors.generic;
  let shouldShowToast = true;

  // Check if this is a known auth error (like after logout)
  const isAuthError = error.message === 'No user is currently logged in' || 
                      error.message === 'No event selected' ||
                      (error.response && error.response.status === 401);

  if (isAuthError) {
    // Don't show toast for auth errors after logout
    finalMessage = error.message;
    shouldShowToast = false;
    console.log('Auth error (expected after logout):', error.message);
  } else if (error.code === 'ECONNABORTED') {
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

  // Only show toast if it's not an auth error
  if (shouldShowToast) {
    showToast('customError', 'Erreur', finalMessage);
  }
  
  return new Error(finalMessage);
};
