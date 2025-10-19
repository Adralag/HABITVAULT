import React from 'react';
import { useOnlineStatus } from '../context/OnlineStatusContext';
import OfflineFallback from './OfflineFallback';

/**
 * A wrapper component that shows the offline fallback page when the user is offline
 */
const OfflineWrapper = ({ children }) => {
  const { isOnline } = useOnlineStatus();
  
  // If offline, show the offline fallback
  if (!isOnline) {
    return <OfflineFallback />;
  }
  
  // Otherwise, show the children
  return children;
};

export default OfflineWrapper;