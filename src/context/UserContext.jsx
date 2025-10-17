import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { getUserProfile, updateUserProfile } from '../firebase/profileUtils';

// Create the User Context
const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { currentUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data whenever the currentUser changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      // Skip if there's no current user or auth is still loading
      if (!currentUser || authLoading) {
        if (isMounted) {
          setLoading(false);
          setUserData(null);
        }
        return;
      }
      
      try {
        setLoading(true);
        const profileData = await getUserProfile(currentUser.uid);
        
        if (isMounted) {
          setUserData(profileData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching user data:", err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, [currentUser, authLoading]);

  // Function to update user data
  const updateUser = async (data) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    try {
      await updateUserProfile(currentUser.uid, data);
      // Update local state
      setUserData(prev => ({
        ...prev,
        ...data
      }));
      return true;
    } catch (err) {
      console.error("Error updating user data:", err);
      setError(err.message);
      throw err;
    }
  };

  // Clear user data on logout
  useEffect(() => {
    if (!currentUser) {
      setUserData(null);
    }
  }, [currentUser]);

  const value = {
    userData,
    loading,
    error,
    updateUser,
    isProfileComplete: !!userData && userData.hasCompletedOnboarding === true
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}