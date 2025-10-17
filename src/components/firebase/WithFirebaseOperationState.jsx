import React from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner } from '../loading';
import FirebaseErrorHandler from './FirebaseErrorHandler';

/**
 * Higher-order component (HOC) that combines loading state and Firebase error handling
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Loading state
 * @param {Error|Object} props.error - Firebase error object
 * @param {Function} props.onRetry - Function to retry the operation
 * @param {string} props.context - Context label for logging
 * @param {React.ReactNode} props.loadingFallback - Custom loading component
 * @param {string} props.loaderSize - Size of the loader ('sm', 'md', 'lg')
 * @param {string} props.loaderColor - Color of the loader ('primary', 'secondary', 'accent')
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to display when there's no error and not loading
 */
const WithFirebaseOperationState = ({ 
  isLoading,
  error,
  onRetry,
  context,
  loadingFallback,
  loaderSize = 'lg',
  loaderColor = 'primary',
  className = '',
  children
}) => {
  if (isLoading) {
    if (loadingFallback) {
      return loadingFallback;
    }
    
    return (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        <LoadingSpinner size={loaderSize} color={loaderColor} />
      </div>
    );
  }

  return (
    <FirebaseErrorHandler 
      error={error}
      onRetry={onRetry}
      context={context}
      className={className}
    >
      {children}
    </FirebaseErrorHandler>
  );
};

WithFirebaseOperationState.propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Error)
  ]),
  onRetry: PropTypes.func,
  context: PropTypes.string,
  loadingFallback: PropTypes.node,
  loaderSize: PropTypes.string,
  loaderColor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default WithFirebaseOperationState;