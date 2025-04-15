

export const handleApiError = (error, customMessage = 'An error occurred') => {
    if (error.response) {
      console.error(`${customMessage} - Server error:`, error.response);
      throw new Error(`${customMessage} - Server Error: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      console.error(`${customMessage} - No response received:`, error.request);
      throw new Error(`${customMessage} - Network Error: No response received from server`);
    } else {
      console.error(`${customMessage} - Unexpected error:`, error.message);
      throw new Error(`${customMessage} - Unexpected Error: ${error.message}`);
    }
  };
