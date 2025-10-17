import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as habitServices from '../firebase/habitServices';
import * as habitUtils from '../firebase/habitUtils';
import useFirebaseOperation from './useFirebaseOperation';
import { handleFirebaseError } from '../firebase/firebaseErrorUtils';

/**
 * Custom hook for managing a single habit
 * @param {string} habitId - The ID of the habit to fetch
 * @returns {Object} - Habit related data and functions
 */
export function useHabit(habitId) {
  const { currentUser } = useAuth();
  const [habit, setHabit] = useState(null);
  const [completionHistory, setCompletionHistory] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  // Use Firebase operation hook for handling loading states and errors
  const {
    isLoading,
    error,
    clearError,
    handleError,
    executeOperation
  } = useFirebaseOperation('Habit');
  
  /**
   * Check if user is authenticated
   * @returns {Error} Error if not authenticated
   */
  const checkAuth = useCallback(() => {
    if (!currentUser) {
      const error = new Error('User not authenticated');
      error.code = 'auth/no-current-user';
      return error;
    }
    return null;
  }, [currentUser]);

  // Fetch the habit when component mounts or habitId changes
  useEffect(() => {
    const fetchHabit = async () => {
      if (!currentUser || !habitId) {
        setHabit(null);
        setIsLoadingInitial(false);
        return;
      }
      
      setIsLoadingInitial(true);
      
      try {
        const habitData = await habitUtils.getHabit(currentUser.uid, habitId);
        setHabit(habitData);
        
        // Fetch completion history
        try {
          const history = await habitServices.getHabitCompletionHistory(
            currentUser.uid,
            habitId,
            28 // Get last 28 days of history
          );
          setCompletionHistory(history);
        } catch (historyError) {
          console.error("Error fetching completion history:", historyError);
          // Don't fail the whole request if history fails
        }
        
        clearError();
      } catch (error) {
        handleError(error);
        setHabit(null);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    
    fetchHabit();
  }, [currentUser, habitId, clearError, handleError]);
  
  /**
   * Update habit data
   * @param {Object} habitData - Updated habit data
   * @returns {Promise<Object>} - Updated habit
   */
  const updateHabit = useCallback(async (habitData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const updatedHabit = await habitUtils.updateHabit(
        currentUser.uid, 
        habitId, 
        habitData
      );
      setHabit(updatedHabit);
      return updatedHabit;
    }, { throwError: true });
  }, [currentUser, habitId, executeOperation, checkAuth]);
  
  /**
   * Delete the habit
   * @returns {Promise<boolean>} - Success status
   */
  const deleteHabit = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitUtils.deleteHabit(currentUser.uid, habitId);
    }, { throwError: true });
  }, [currentUser, habitId, executeOperation, checkAuth]);
  
  /**
   * Mark habit as complete for today
   * @returns {Promise<Object>} - Updated habit
   */
  const completeHabit = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const updatedHabit = await habitUtils.completeHabitForToday(
        currentUser.uid,
        habitId
      );
      
      // Refresh the completion history
      const history = await habitServices.getHabitCompletionHistory(
        currentUser.uid,
        habitId,
        28
      );
      
      setHabit(updatedHabit);
      setCompletionHistory(history);
      
      return updatedHabit;
    }, { throwError: true });
  }, [currentUser, habitId, executeOperation, checkAuth]);
  
  /**
   * Archive the habit
   * @returns {Promise<boolean>} - Success status
   */
  const archiveHabit = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const success = await habitServices.archiveHabit(currentUser.uid, habitId);
      if (success && habit) {
        setHabit({
          ...habit,
          status: 'archived'
        });
      }
      return success;
    }, { throwError: true });
  }, [currentUser, habitId, habit, executeOperation, checkAuth]);
  
  /**
   * Restore the habit from archive
   * @returns {Promise<boolean>} - Success status
   */
  const restoreHabit = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const success = await habitServices.restoreHabit(currentUser.uid, habitId);
      if (success && habit) {
        setHabit({
          ...habit,
          status: 'active'
        });
      }
      return success;
    }, { throwError: true });
  }, [currentUser, habitId, habit, executeOperation, checkAuth]);
  
  /**
   * Save habit notes
   * @param {string} notes - Notes content
   * @returns {Promise<Object>} - Updated habit
   */
  const saveNotes = useCallback(async (notes) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const updatedHabit = await habitUtils.updateHabit(
        currentUser.uid, 
        habitId, 
        { notes }
      );
      setHabit(updatedHabit);
      return updatedHabit;
    }, { throwError: true });
  }, [currentUser, habitId, executeOperation, checkAuth]);
  
  /**
   * Check if the habit has been completed today
   * @returns {boolean} - Completed status
   */
  const isCompletedToday = useCallback(() => {
    if (!habit || !habit.lastCompletedDate) return false;
    
    const lastCompleted = new Date(habit.lastCompletedDate.seconds * 1000);
    const today = new Date();
    
    // Compare just the dates (not time)
    return (
      lastCompleted.getFullYear() === today.getFullYear() &&
      lastCompleted.getMonth() === today.getMonth() &&
      lastCompleted.getDate() === today.getDate()
    );
  }, [habit]);
  
  /**
   * Format completion history for calendar display
   * @returns {Array} - Formatted history for calendar
   */
  const getFormattedHistory = useCallback(() => {
    if (!completionHistory.length) return [];
    
    const now = new Date();
    const days = [];
    
    // Generate days for last 28 days
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayNum = date.getDate();
      
      // Check if day is in completion history
      const completed = completionHistory.some(item => 
        item.dateString === dateString
      );
      
      const isToday = i === 0;
      
      days.push({ 
        day: dayNum, 
        completed, 
        isToday, 
        date: dateString 
      });
    }
    
    return days;
  }, [completionHistory]);
  
  // Combine loading states
  const loading = isLoadingInitial || isLoading;
  
  return {
    habit,
    loading,
    error,
    clearError,
    updateHabit,
    deleteHabit,
    completeHabit,
    archiveHabit,
    restoreHabit,
    saveNotes,
    isCompletedToday,
    completionHistory,
    getFormattedHistory
  };
}
