import React from 'react';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner (sm, md, lg)
 * @param {string} props.color - Color of spinner (primary, secondary, white)
 * @param {string} props.className - Additional classes
 */
const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const colorClasses = {
    primary: 'border-t-primary',
    secondary: 'border-t-secondary',
    accent: 'border-t-accent',
    white: 'border-t-white',
  };

  return (
    <div className={`spinner ${className}`}>
      <div 
        className={`
          animate-spin rounded-full 
          border-gray-200 dark:border-gray-600
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
      />
    </div>
  );
};

/**
 * Full page loading component
 */
const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50">
      <LoadingSpinner size="lg" />
    </div>
  );
};

/**
 * Content loading skeleton
 */
const ContentSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"
          style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
        />
      ))}
    </div>
  );
};

/**
 * Card loading skeleton
 */
const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse mb-4"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="flex justify-between mt-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
        </div>
      ))}
    </>
  );
};

export { LoadingSpinner, FullPageLoading, ContentSkeleton, CardSkeleton };