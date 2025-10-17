import React from 'react';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner (sm, md, lg)
 * @param {string} props.color - Color of spinner (accent, primary, gray)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Spinner component
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'accent',
  className = '' 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };
  
  // Color classes
  const colorClasses = {
    accent: 'border-t-accent',
    primary: 'border-t-primary',
    gray: 'border-t-gray-600 dark:border-t-gray-300',
    white: 'border-t-white'
  };
  
  return (
    <div className={`animate-spin rounded-full border-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
  );
};

/**
 * Loading overlay for sections that are loading
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether loading is active
 * @param {string} props.text - Loading text
 * @param {React.ReactNode} props.children - Child elements
 * @returns {JSX.Element} - Loading overlay component
 */
export const LoadingOverlay = ({ 
  isLoading, 
  text = 'Loading...', 
  children 
}) => {
  if (!isLoading) return children;
  
  return (
    <div className="relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
        <LoadingSpinner size="lg" color="accent" />
        {text && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
            {text}
          </p>
        )}
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

/**
 * Loading error message
 * @param {Object} props - Component props
 * @param {string} props.error - Error message
 * @param {Function} props.onRetry - Retry callback
 * @returns {JSX.Element} - Error message component
 */
export const ErrorMessage = ({ 
  error, 
  onRetry 
}) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{error}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Empty state component
 * @param {Object} props - Component props
 * @param {string} props.title - Empty state title
 * @param {string} props.message - Empty state message
 * @param {React.ReactNode} props.icon - Icon component
 * @param {React.ReactNode} props.action - Action button or link
 * @returns {JSX.Element} - Empty state component
 */
export const EmptyState = ({ 
  title, 
  message, 
  icon, 
  action 
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>
      )}
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {message}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;