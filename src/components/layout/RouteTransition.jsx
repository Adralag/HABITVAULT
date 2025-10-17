import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../ui/loading/LoadingScreen';

/**
 * RouteTransition component handles displaying a loading screen during page transitions
 * This component should wrap the entire application content within the Router
 */
const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevLocation, setPrevLocation] = useState('');

  useEffect(() => {
    // Only show loading on actual route changes, not initial load
    if (prevLocation && prevLocation !== location.pathname) {
      setIsLoading(true);
      
      // Use longer loading time for transitions between landing and auth pages
      const isAuthTransition = 
        (prevLocation === '/' && (location.pathname === '/login' || location.pathname === '/signup')) ||
        ((prevLocation === '/login' || prevLocation === '/signup') && location.pathname === '/');
        
      const loadingTime = isAuthTransition ? 1200 : 800; // Longer time for auth transitions
      
      // Simulate page loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, loadingTime); // Adjust timing as needed
      
      return () => clearTimeout(timer);
    } else {
      setPrevLocation(location.pathname);
    }
  }, [location.pathname, prevLocation]);

  return (
    <>
      <LoadingScreen isVisible={isLoading} />
      {children}
    </>
  );
};

export default RouteTransition;