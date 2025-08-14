import { TOAST_MESSAGES } from '../../constants/toastMessages';
import { showToast } from '../ui/toastUtils';

// Define a comprehensive error type that covers all the error scenarios
interface ApiErrorResponse {
  status: number;
  data?: unknown;
}

interface ApiError {
  message?: string;
  code?: string;
  response?: ApiErrorResponse;
}

// Union type for all possible error types
type HandleableError = ApiError | Error | { message: string } | unknown;

// Type guard functions
const hasMessage = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error && 
         typeof (error as Record<string, unknown>).message === 'string';
};

const hasCode = (error: unknown): error is { code: string } => {
  return typeof error === 'object' && error !== null && 'code' in error && 
         typeof (error as Record<string, unknown>).code === 'string';
};

const hasResponse = (error: unknown): error is { response: { status: number } } => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return false;
  }
  const errorWithResponse = error as Record<string, unknown>;
  const response = errorWithResponse.response;
  return typeof response === 'object' && response !== null &&
         'status' in response && typeof (response as Record<string, unknown>).status === 'number';
};

const hasRequest = (error: unknown): error is { request: unknown } => {
  return typeof error === 'object' && error !== null && 'request' in error;
};

export const handleApiError = (error: HandleableError, customMessage = TOAST_MESSAGES.errors.generic) => {
  let finalMessage = TOAST_MESSAGES.errors.generic;
  let shouldShowToast = true;

  // Check if this is a known auth error (like after logout)
  const errorMessage = hasMessage(error) ? error.message : '';
  const isAuthError = errorMessage === 'No user is currently logged in' || 
                      errorMessage === 'No event selected' ||
                      (hasResponse(error) && error.response.status === 401);

  if (isAuthError) {
    // Don't show toast for auth errors after logout
    finalMessage = errorMessage;
    shouldShowToast = false;
    console.log('Auth error (expected after logout):', errorMessage);
  } else if (hasCode(error) && error.code === 'ECONNABORTED') {
    finalMessage = TOAST_MESSAGES.errors.timeout;
  } else if (hasResponse(error)) {
    console.error(`${customMessage} - Server error:`, error.response);
    finalMessage = TOAST_MESSAGES.errors.serverError(error.response.status);
  } else if (hasRequest(error)) {
    console.error(`${customMessage} - No response received:`, error.request);
    finalMessage = TOAST_MESSAGES.errors.noResponse;
  } else {
    const errorMsg = hasMessage(error) ? error.message : 'Unknown error';
    console.error(`${customMessage} - Unexpected error:`, errorMsg);
    finalMessage = TOAST_MESSAGES.errors.custom(errorMsg);
  }

  // Only show toast if it's not an auth error
  if (shouldShowToast) {
    showToast('customError', 'Erreur', finalMessage);
  }
  
  return new Error(finalMessage);
};
