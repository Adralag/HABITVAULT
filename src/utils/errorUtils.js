/**
 * Formats error messages from various error sources
 * @param {Error|Object} error - Error object
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle Axios/API errors
  if (error.response) {
    // Server responded with a non-2xx status
    const serverMessage = error.response.data?.message || error.response.data?.error;
    if (serverMessage) return serverMessage;
    
    // Handle common status codes
    switch (error.response.status) {
      case 400: return 'Invalid request. Please check your data.';
      case 401: return 'Your session has expired. Please log in again.';
      case 403: return 'You don\'t have permission to access this resource.';
      case 404: return 'The requested resource could not be found.';
      case 422: return 'The provided data is invalid.';
      case 429: return 'Too many requests. Please try again later.';
      case 500: return 'A server error occurred. Please try again later.';
      default: return `Error ${error.response.status}: ${error.response.statusText}`;
    }
  }
  
  // Handle network errors
  if (error.request) {
    // Request made but no response received
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Handle other errors
  return error.message || 'An unknown error occurred';
};

/**
 * Determines the error variant based on error type
 * @param {Error|Object} error - Error object
 * @returns {string} Error variant ('default', 'network', 'auth', 'notFound')
 */
export const getErrorVariant = (error) => {
  if (!error) return 'default';
  
  // Network errors
  if (error.name === 'NetworkError' || 
      error.message?.includes('network') || 
      error.message?.includes('connection') || 
      error.code === 'ECONNREFUSED' || 
      (error.request && !error.response)) {
    return 'network';
  }
  
  // Authentication errors
  if (error.response?.status === 401 || error.response?.status === 403) {
    return 'auth';
  }
  
  // Not found errors
  if (error.response?.status === 404) {
    return 'notFound';
  }
  
  return 'default';
};

/**
 * Creates a standardized error object
 * @param {Error|Object} error - Original error
 * @returns {Object} Standardized error object
 */
export const standardizeError = (error) => {
  return {
    message: formatErrorMessage(error),
    variant: getErrorVariant(error),
    status: error?.response?.status,
    originalError: error
  };
};

/**
 * Logs errors in a consistent format
 * @param {Error|Object} error - Error to log
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = 'Application') => {
  console.error(`[${context}] Error:`, error);
  
  // In production, you could send to error tracking service here
  if (import.meta.env.PROD) {
    // Example: Send to hypothetical error tracking service
    // errorTrackingService.captureError(error, { context });
  }
};

export default {
  formatErrorMessage,
  getErrorVariant,
  standardizeError,
  logError
};