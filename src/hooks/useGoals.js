import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as goalServices from '../firebase/goalServices';
import useFirebaseOperation from './useFirebaseOperation';
import { handleFirebaseError } from '../firebase/firebaseErrorUtils';
import * as habitServices from '../firebase/habitServices';

/**
 * Custom hook for managing goal data
 * @returns {Object} - Goal related data and functions
 */
export function useGoals() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [achievements, setAchievements] = useState({
    longestStreak: 0,
    totalCompletions: 0,
    goalsAchieved: 0
  });
  const [habits, setHabits] = useState([]);
  
  // Use Firebase operation hook for handling loading states and errors
  const {
    isLoading,
    error,
    clearError,
    handleError,
    executeOperation
  } = useFirebaseOperation('Goals');
  
  // Subscribe to goals when component mounts
  useEffect(() => {
    if (!currentUser) {
      setGoals([]);
      setIsLoadingInitial(false);
      return () => {};
    }
    
    setIsLoadingInitial(true);
    
    const unsubscribe = goalServices.subscribeToGoals(
      currentUser.uid,
      (goalsData, err) => {
        if (err) {
          handleError(err);
        } else {
          setGoals(goalsData);
          clearError();
        }
        setIsLoadingInitial(false);
      }
    );
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, [currentUser, handleError, clearError]);
  
  // Load habits for goal creation/editing
  useEffect(() => {
    if (!currentUser) {
      setHabits([]);
      return;
    }
    
    const loadHabits = async () => {
      try {
        const habitsData = await habitServices.getHabitsByStatus(currentUser.uid, 'active');
        setHabits(habitsData);
      } catch (error) {
        console.error('Error loading habits for goals:', error);
      }
    };
    
    loadHabits();
  }, [currentUser]);
  
  // Load achievement stats
  useEffect(() => {
    if (!currentUser) {
      setAchievements({
        longestStreak: 0,
        totalCompletions: 0,
        goalsAchieved: 0
      });
      return;
    }
    
    const loadAchievements = async () => {
      try {
        const stats = await goalServices.getAchievementStats(currentUser.uid);
        setAchievements(stats);
      } catch (error) {
        console.error('Error loading achievement stats:', error);
      }
    };
    
    loadAchievements();
  }, [currentUser, goals]); // Refresh when goals change
  
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
   * Add a new goal
   * @param {Object} goalData - Goal data
   * @returns {Promise<Object>} - New goal
   */
  const addGoal = useCallback(async (goalData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      // If habitId is provided, get the habit name
      if (goalData.habitId) {
        const matchingHabit = habits.find(h => h.id === goalData.habitId);
        if (matchingHabit) {
          goalData.habitName = matchingHabit.name;
        }
      }
      
      return await goalServices.addGoal(currentUser.uid, goalData);
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth, habits]);
  
  /**
   * Update a goal
   * @param {string} goalId - Goal ID
   * @param {Object} goalData - Updated goal data
   * @returns {Promise<Object>} - Updated goal
   */
  const updateGoal = useCallback(async (goalId, goalData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      // If habitId is provided, get the habit name
      if (goalData.habitId) {
        const matchingHabit = habits.find(h => h.id === goalData.habitId);
        if (matchingHabit) {
          goalData.habitName = matchingHabit.name;
        }
      }
      
      return await goalServices.updateGoal(
        currentUser.uid, 
        goalId, 
        goalData
      );
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth, habits]);
  
  /**
   * Delete a goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<boolean>} - Success status
   */
  const deleteGoal = useCallback(async (goalId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await goalServices.deleteGoal(currentUser.uid, goalId);
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Update goal progress
   * @param {string} goalId - Goal ID
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise<Object>} - Updated goal
   */
  const updateProgress = useCallback(async (goalId, progress) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      return await goalServices.updateGoalProgress(
        currentUser.uid,
        goalId,
        progress
      );
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Get active goals
   * @returns {Array} - Active goals
   */
  const getActiveGoals = useCallback(() => {
    return goals.filter(goal => goal.status === 'active');
  }, [goals]);
  
  /**
   * Get completed goals
   * @returns {Array} - Completed goals
   */
  const getCompletedGoals = useCallback(() => {
    return goals.filter(goal => goal.status === 'completed');
  }, [goals]);
  
  /**
   * Get goals by habit ID
   * @param {string} habitId - Habit ID
   * @returns {Array} - Goals for that habit
   */
  const getGoalsByHabit = useCallback((habitId) => {
    return goals.filter(goal => goal.habitId === habitId);
  }, [goals]);
  
  // Combine initial loading state with operation loading state
  const loading = isLoadingInitial || isLoading;
  
  return {
    goals,
    loading,
    error,
    clearError,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    getActiveGoals,
    getCompletedGoals,
    getGoalsByHabit,
    achievements,
    habits
  };
}

export default useGoals;