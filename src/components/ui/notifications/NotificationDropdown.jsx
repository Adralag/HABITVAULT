import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import LoadingSpinner from '../LoadingStates';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle marking all as read
  const handleMarkAllAsRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Handle marking a single notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification button with badge */}
      <button 
        className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent relative"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">View notifications</span>
        <svg 
          className="h-6 w-6" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {/* Notification badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform translate-x-1 -translate-y-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notifications-menu"
        >
          <div className="py-1" role="none">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button 
                  className="text-xs font-medium text-accent hover:text-accent-dark"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {/* Content */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 5).map(notification => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  />
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/dashboard/notifications"
                className="block px-4 py-2 text-sm text-center font-medium text-accent hover:text-accent-dark"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;