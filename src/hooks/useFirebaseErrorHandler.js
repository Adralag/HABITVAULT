import { useState, useCallback } from 'react';
import { handleFirebaseError } from '../firebase/firebaseErrorUtils';

/**
 * Custom hook for handling Firebase-specific errors
 * @param {string} context - Context label for error logging
 * @returns {Object} Firebase error handling utilities
 */
const useFirebaseErrorHandler = (context = 'Firebase') => {
  const [error, setError] = useState(null);

  /**
   * Clear any existing errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle a Firebase error
   * @param {Error} err - The error to handle
   * @param {boolean} silent - Whether to suppress setting state
   * @returns {Object} Processed error information
   */
  const handleError = useCallback((err, silent = false) => {
    if (!err) return null;
    
    // Process the Firebase error
    const processedError = handleFirebaseError(err, silent, context);
    
    // Update state if not silent
    if (!silent) {
      setError(processedError);
    }
    
    return processedError;
  }, [context]);

  /**
   * Wrap an async function with Firebase error handling
   * @param {Function} fn - The async function to wrap
   * @returns {Function} Wrapped function with error handling
   */
  const withErrorHandling = useCallback((fn) => {
    return async (...args) => {
      try {
        clearError();
        return await fn(...args);
      } catch (err) {
        handleError(err);
        throw err; // Re-throw for caller to handle if needed
      }
    };
  }, [clearError, handleError]);

  return {
    error,
    setError,
    clearError,
    handleError,
    withErrorHandling
  };
};

export default useFirebaseErrorHandler;