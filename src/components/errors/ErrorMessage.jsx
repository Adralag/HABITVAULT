import React from 'react';

/**
 * Error message component for displaying various error states
 * @param {Object} props - Component props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Retry function
 * @param {string} props.retryText - Text for retry button
 * @param {Object} props.error - Error object (only displayed in development)
 * @param {string} props.variant - Error variant (default, network, auth, notFound)
 * @param {string} props.className - Additional classes
 */
const ErrorMessage = ({
  title = "An error occurred",
  message = "Something went wrong. Please try again later.",
  onRetry,
  retryText = "Try Again",
  error,
  variant = "default",
  className = ""
}) => {
  // Variant-specific content
  const variants = {
    default: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: title,
      message: message
    },
    network: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13l4 4m0 0l4-4m-4 4v-6" />
        </svg>
      ),
      title: title || "Network Error",
      message: message || "Unable to connect to the server. Please check your internet connection and try again."
    },
    auth: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: title || "Authentication Error",
      message: message || "You don't have permission to access this resource. Please log in and try again."
    },
    notFound: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: title || "Not Found",
      message: message || "The resource you're looking for doesn't exist or has been removed."
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="w-16 h-16 text-red-500 mb-4">
        {currentVariant.icon}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {currentVariant.title}
      </h2>
      
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        {currentVariant.message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        >
          {retryText}
        </button>
      )}
      
      {import.meta.env.DEV && error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-md text-left w-full">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">
            Development Error Details:
          </p>
          <pre className="text-red-600 dark:text-red-400 text-xs mt-2 whitespace-pre-wrap overflow-auto max-h-32 font-mono">
            {error.toString()}
            {error.stack ? `\n${error.stack}` : ''}
          </pre>
        </div>
      )}
    </div>
  );
};

/**
 * Empty state component for when no data is available
 * @param {Object} props - Component props
 * @param {string} props.title - Empty state title
 * @param {string} props.message - Empty state message
 * @param {Function} props.onAction - Action function
 * @param {string} props.actionText - Text for action button
 * @param {string} props.className - Additional classes
 */
const EmptyState = ({
  title = "No data found",
  message = "There's nothing here yet.",
  onAction,
  actionText = "Create New",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="w-16 h-16 text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        {message}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

/**
 * Form field error component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 */
const FormFieldError = ({ message }) => {
  if (!message) return null;
  
  return (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
};

export { ErrorMessage, EmptyState, FormFieldError };