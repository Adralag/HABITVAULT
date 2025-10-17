import React from 'react';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'reminder':
      return (
        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'missed':
      return (
        <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'achievement':
      return (
        <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { type, title, message, read, createdAt } = notification;
  
  // Format relative time
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <div 
      className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
        !read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={!read ? onMarkAsRead : undefined}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getNotificationIcon(type)}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              !read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(createdAt)}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {message}
          </p>
          {!read && (
            <div className="mt-2 flex justify-end">
              <button 
                className="text-xs font-medium text-accent hover:text-accent-dark"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
              >
                Mark as read
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;