import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
export const OnlineStatusContext = createContext({
  isOnline: true,
  setIsOnline: () => {},
});

export const OnlineStatusProvider = ({ children }) => {
  // Get initial online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Event handlers
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

// Custom hook to use the online status context
export const useOnlineStatus = () => useContext(OnlineStatusContext);