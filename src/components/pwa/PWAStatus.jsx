import React from 'react';
import { useOnlineStatus } from '../../context/OnlineStatusContext';

/**
 * PWA Status Component
 * Shows a small indicator for the current online/offline status
 */
const PWAStatus = () => {
  const { isOnline } = useOnlineStatus();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        isOnline 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        <span className={`h-2 w-2 rounded-full mr-1.5 ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
        {isOnline ? 'Online' : 'Offline'}
      </div>
    </div>
  );
};

export default PWAStatus;