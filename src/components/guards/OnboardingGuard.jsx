import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import { hasCompletedOnboarding } from '../../firebase/profileUtils';

const OnboardingGuard = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [hasCompleted, setHasCompleted] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!currentUser) {
        setIsChecking(false);
        return;
      }
      
      try {
        const completed = await hasCompletedOnboarding(currentUser.uid);
        setHasCompleted(completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to true in case of error to prevent users from getting stuck
        setHasCompleted(true);
      } finally {
        setIsChecking(false);
      }
    };
    
    if (!loading) {
      checkOnboardingStatus();
    }
  }, [currentUser, loading]);
  
  // Still loading or checking onboarding status
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  // Not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  // User has not completed onboarding and is not on the onboarding page
  if (!hasCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" state={{ from: location }} />;
  }
  
  // User has completed onboarding but is trying to access the onboarding page
  if (hasCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export default OnboardingGuard;