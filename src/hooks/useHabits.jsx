import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as habitServices from '../firebase/habitServices';
import * as habitUtils from '../firebase/habitUtils';
import useFirebaseOperation from './useFirebaseOperation';
import { handleFirebaseError } from '../firebase/firebaseErrorUtils';

/**
 * Custom hook for managing habit data
 * @returns {Object} - Habit related data and functions
 */
export function useHabits() {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  // Use Firebase operation hook for handling loading states and errors
  const {
    isLoading,
    error,
    clearError,
    handleError,
    executeOperation
  } = useFirebaseOperation('Habits');
  
  // Subscribe to habits when component mounts
  useEffect(() => {
    if (!currentUser) {
      setHabits([]);
      setIsLoadingInitial(false);
      return () => {};
    }
    
    setIsLoadingInitial(true);
    
    const unsubscribe = habitServices.subscribeToHabits(
      currentUser.uid,
      (habitsData, err) => {
        if (err) {
          handleError(err);
        } else {
          setHabits(habitsData);
          clearError();
        }
        setIsLoadingInitial(false);
      }
    );
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, [currentUser, handleError, clearError]);
  
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
  
  /**
   * Add a new habit
   * @param {Object} habitData - Habit data
   * @returns {Promise<Object>} - New habit
   */
  const addHabit = useCallback(async (habitData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitUtils.addHabit(currentUser.uid, habitData);
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Update a habit
   * @param {string} habitId - Habit ID
   * @param {Object} habitData - Updated habit data
   * @returns {Promise<Object>} - Updated habit
   */
  const updateHabit = useCallback(async (habitId, habitData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitUtils.updateHabit(
        currentUser.uid, 
        habitId, 
        habitData
      );
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Delete a habit
   * @param {string} habitId - Habit ID
   * @returns {Promise<boolean>} - Success status
   */
  const deleteHabit = useCallback(async (habitId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitUtils.deleteHabit(currentUser.uid, habitId);
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Complete a habit for today
   * @param {string} habitId - Habit ID
   * @returns {Promise<Object>} - Updated habit
   */
  const completeHabit = useCallback(async (habitId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitUtils.completeHabitForToday(
        currentUser.uid,
        habitId
      );
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Get active habits
   * @returns {Array} - Active habits
   */
  const getActiveHabits = useCallback(() => {
    return habits.filter(habit => habit.status === 'active');
  }, [habits]);
  
  /**
   * Get habits by category
   * @param {string} category - Category
   * @returns {Array} - Habits in category
   */
  const getHabitsByCategory = useCallback((category) => {
    return habits.filter(habit => habit.category === category);
  }, [habits]);
  
  /**
   * Archive a habit
   * @param {string} habitId - Habit ID
   * @returns {Promise<boolean>} - Success status
   */
  const archiveHabit = useCallback(async (habitId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitServices.archiveHabit(currentUser.uid, habitId);
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Restore an archived habit
   * @param {string} habitId - Habit ID
   * @returns {Promise<boolean>} - Success status
   */
  const restoreHabit = useCallback(async (habitId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitServices.restoreHabit(currentUser.uid, habitId);
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Get habit statistics
   * @returns {Promise<Object>} - Habit statistics
   */
  const getHabitStats = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await habitServices.getHabitStreakData(currentUser.uid);
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  // Combine initial loading state with operation loading state
  const loading = isLoadingInitial || isLoading;
  
  return {
    habits,
    loading,
    error,
    clearError,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getActiveHabits,
    getHabitsByCategory,
    archiveHabit,
    restoreHabit,
    getHabitStats
  };
}