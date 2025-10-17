import { useState, useCallback } from 'react';
import { standardizeError, logError } from '../utils/errorUtils';

/**
 * Custom hook for handling API errors
 * @returns {Object} Error handling utilities
 */
const useErrorHandler = () => {
  const [error, setError] = useState(null);

  /**
   * Clear any existing errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle an API error
   * @param {Error} err - The error to handle
   * @param {boolean} silent - Whether to suppress setting state
   * @param {string} context - Context where the error occurred
   * @returns {Object} Processed error information
   */
  const handleError = useCallback((err, silent = false, context = 'API') => {
    // Standardize the error format
    const processedError = standardizeError(err);
    
    // Log error with context
    logError(err, context);

    // Update state if not silent
    if (!silent) {
      setError(processedError);
    }

    return processedError;
  }, []);

  /**
   * Wrap an async function with error handling
   * @param {Function} fn - The async function to wrap
   * @param {string} context - Optional context for error logging
   * @returns {Function} Wrapped function with error handling
   */
  const withErrorHandling = useCallback((fn, context = 'API') => {
    return async (...args) => {
      try {
        clearError();
        return await fn(...args);
      } catch (err) {
        handleError(err, false, context);
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

export default useErrorHandler;