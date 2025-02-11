 
import * as Sentry from '@sentry/node';

const isDevelopment = process.env.NODE_ENV === 'development';

export const handleError = (error, customMessage = 'An error occurred') => {
  
  if (!isDevelopment) {
    Sentry.captureException(error);
  }

   
  if (isDevelopment) {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        message: error.message
      });
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }

  // Return a user-friendly error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  return customMessage;
};
