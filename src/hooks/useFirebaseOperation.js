import { useState, useCallback } from 'react';
import useFirebaseErrorHandler from './useFirebaseErrorHandler';

/**
 * Custom hook that combines loading state management with Firebase error handling
 * @param {string} context - Context label for error logging
 * @returns {Object} Loading and error handling utilities
 */
const useFirebaseOperation = (context = 'Firebase') => {
  const [isLoading, setIsLoading] = useState(false);
  const { error, clearError, handleError, withErrorHandling } = useFirebaseErrorHandler(context);

  /**
   * Execute an async operation with loading state and error handling
   * @param {Function} operation - Async function to execute
   * @param {Object} options - Operation options
   * @param {boolean} options.resetErrorBeforeExecution - Whether to clear errors before execution
   * @param {boolean} options.throwError - Whether to rethrow caught errors
   * @returns {Promise<*>} Operation result or null if error occurred
   */
  const executeOperation = useCallback(async (operation, options = {}) => {
    const { resetErrorBeforeExecution = true, throwError = false } = options;
    
    try {
      setIsLoading(true);
      if (resetErrorBeforeExecution) {
        clearError();
      }
      
      return await operation();
    } catch (err) {
      handleError(err);
      if (throwError) {
        throw err;
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  /**
   * Creates a wrapped version of the provided function that handles loading state and errors
   * @param {Function} fn - Function to wrap
   * @returns {Function} Wrapped function
   */
  const createWrappedOperation = useCallback((fn) => {
    return async (...args) => {
      return executeOperation(() => fn(...args));
    };
  }, [executeOperation]);

  return {
    isLoading,
    setIsLoading,
    error,
    clearError,
    handleError,
    executeOperation,
    createWrappedOperation,
    withErrorHandling
  };
};

export default useFirebaseOperation;