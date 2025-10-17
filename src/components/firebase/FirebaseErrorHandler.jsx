import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from '../errors';
import { handleFirebaseError } from '../../firebase/firebaseErrorUtils';

/**
 * Component to handle and display Firebase-specific errors
 * 
 * @param {Object} props - Component props
 * @param {Error|Object} props.error - Firebase error object
 * @param {Function} props.onRetry - Function to retry the operation
 * @param {string} props.context - Context label for logging
 * @param {React.ReactNode} props.children - Content to display when there's no error
 * @param {string} props.className - Additional CSS classes
 */
const FirebaseErrorHandler = ({ 
  error, 
  onRetry, 
  context = 'Firebase', 
  children, 
  className = ''
}) => {
  if (!error) {
    return children;
  }

  // Process the Firebase error
  const processedError = handleFirebaseError(error, true, context);

  return (
    <ErrorMessage
      variant={processedError.variant}
      title={`${context} Error`}
      message={processedError.message}
      onRetry={onRetry}
      error={import.meta.env.DEV ? processedError.originalError : null}
      className={className}
    />
  );
};

FirebaseErrorHandler.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Error)
  ]),
  onRetry: PropTypes.func,
  context: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default FirebaseErrorHandler;