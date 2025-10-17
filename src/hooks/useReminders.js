import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as reminderServices from '../firebase/reminderServices';
import useFirebaseOperation from './useFirebaseOperation';

/**
 * Custom hook for managing reminders
 * @returns {Object} Reminder related data and functions
 */
export function useReminders() {
  const { currentUser } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [activeReminders, setActiveReminders] = useState([]);
  const [inactiveReminders, setInactiveReminders] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  // Use Firebase operation hook for handling loading states and errors
  const {
    isLoading,
    error,
    clearError,
    handleError,
    executeOperation
  } = useFirebaseOperation('Reminders');
  
  // Process reminders to separate active and inactive
  const processReminders = useCallback((reminderList) => {
    const active = reminderList.filter(r => r.active);
    const inactive = reminderList.filter(r => !r.active);
    
    setReminders(reminderList);
    setActiveReminders(active);
    setInactiveReminders(inactive);
  }, []);
  
  // Subscribe to reminders when component mounts
  useEffect(() => {
    if (!currentUser) {
      setReminders([]);
      setActiveReminders([]);
      setInactiveReminders([]);
      setIsLoadingInitial(false);
      return () => {};
    }
    
    setIsLoadingInitial(true);
    
    const unsubscribe = reminderServices.subscribeToReminders(
      currentUser.uid,
      (remindersData, err) => {
        if (err) {
          handleError(err);
        } else {
          processReminders(remindersData);
          clearError();
        }
        setIsLoadingInitial(false);
      }
    );
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, [currentUser, handleError, clearError, processReminders]);
  
  /**
   * Check if user is authenticated
   * @returns {Error|null} Error if not authenticated, null otherwise
   */
  const checkAuth = useCallback(() => {
    if (!currentUser) {
      const error = new Error('User not authenticated');
      error.code = 'auth/no-current-user';
      return error;
    }
    return null;
  }, [currentUser]);
  
  /**
   * Create a new reminder
   * @param {Object} reminderData - Reminder data
   * @returns {Promise<Object>} Created reminder
   */
  const createReminder = useCallback(async (reminderData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await reminderServices.createReminder(
        currentUser.uid, 
        reminderData
      );
    });
  }, [currentUser, executeOperation, checkAuth, handleError]);
  
  /**
   * Update an existing reminder
   * @param {string} reminderId - Reminder ID
   * @param {Object} reminderData - Updated reminder data
   * @returns {Promise<Object>} Updated reminder
   */
  const updateReminder = useCallback(async (reminderId, reminderData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await reminderServices.updateReminder(
        currentUser.uid, 
        reminderId, 
        reminderData
      );
    });
  }, [currentUser, executeOperation, checkAuth, handleError]);
  
  /**
   * Toggle the active status of a reminder
   * @param {string} reminderId - Reminder ID
   * @returns {Promise<Object>} Updated reminder
   */
  const toggleReminderStatus = useCallback(async (reminderId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await reminderServices.toggleReminderStatus(
        currentUser.uid, 
        reminderId
      );
    });
  }, [currentUser, executeOperation, checkAuth, handleError]);
  
  /**
   * Delete a reminder
   * @param {string} reminderId - Reminder ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteReminder = useCallback(async (reminderId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await reminderServices.deleteReminder(
        currentUser.uid, 
        reminderId
      );
    });
  }, [currentUser, executeOperation, checkAuth, handleError]);
  
  /**
   * Get reminders for a specific habit
   * @param {string} habitId - Habit ID
   * @returns {Promise<Array>} List of reminders for the habit
   */
  const getRemindersForHabit = useCallback(async (habitId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await reminderServices.getRemindersForHabit(
        currentUser.uid, 
        habitId
      );
    });
  }, [currentUser, executeOperation, checkAuth, handleError]);

  // Combine initial loading state with operation loading state
  const loading = isLoadingInitial || isLoading;
  
  return {
    reminders,
    activeReminders,
    inactiveReminders,
    loading,
    error,
    clearError,
    createReminder,
    updateReminder,
    toggleReminderStatus,
    deleteReminder,
    getRemindersForHabit
  };
}

export default useReminders;