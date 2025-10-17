import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as progressServices from '../firebase/progressServices';
import useFirebaseOperation from './useFirebaseOperation';
import { handleFirebaseError } from '../firebase/firebaseErrorUtils';

/**
 * Custom hook for managing habit progress data
 * @returns {Object} - Progress data and functions
 */
export function useProgress() {
  const { currentUser } = useAuth();
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [habitDistribution, setHabitDistribution] = useState([]);
  const [streaks, setStreaks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  // Use Firebase operation hook for handling loading states and errors
  const {
    isLoading,
    error,
    clearError,
    handleError,
    executeOperation
  } = useFirebaseOperation('Progress');
  
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
   * Load weekly progress data
   * @param {number} weeks - Number of weeks to look back
   * @returns {Promise<Object>} - Weekly progress data
   */
  const loadWeeklyData = useCallback(async (weeks = 1) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const data = await progressServices.getWeeklyCompletionData(currentUser.uid, weeks);
      setWeeklyData(data.weeklyData);
      return data;
    });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Load monthly progress data
   * @param {number} months - Number of months to look back
   * @returns {Promise<Object>} - Monthly progress data
   */
  const loadMonthlyData = useCallback(async (months = 6) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const data = await progressServices.getMonthlyCompletionData(currentUser.uid, months);
      setMonthlyData(data.monthlyData);
      return data;
    });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Load habit distribution data
   * @param {number} days - Number of days to look back
   * @returns {Promise<Array>} - Habit distribution data
   */
  const loadHabitDistribution = useCallback(async (days = 30) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const data = await progressServices.getHabitDistributionData(currentUser.uid, days);
      setHabitDistribution(data);
      return data;
    });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Load current streaks
   * @returns {Promise<Array>} - Streak data
   */
  const loadStreaks = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const data = await progressServices.getCurrentStreaks(currentUser.uid);
      setStreaks(data);
      return data;
    });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Load achievements
   * @returns {Promise<Array>} - Achievement data
   */
  const loadAchievements = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const data = await progressServices.getAchievements(currentUser.uid);
      setAchievements(data);
      return data;
    });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Load all progress data
   * @param {string} timeRange - 'weekly' or 'monthly'
   * @returns {Promise<void>}
   */
  const loadAllProgressData = useCallback(async (timeRange = 'weekly') => {
    const authError = checkAuth();
    if (authError) {
      // Not authenticated, nothing to load
      return;
    }
    
    try {
      if (timeRange === 'weekly') {
        await loadWeeklyData();
      } else {
        await loadMonthlyData();
      }
      
      await Promise.all([
        loadHabitDistribution(),
        loadStreaks(),
        loadAchievements()
      ]);
    } catch (error) {
      console.error('Error loading progress data:', error);
      handleError(error);
    }
  }, [
    checkAuth,
    loadWeeklyData,
    loadMonthlyData,
    loadHabitDistribution,
    loadStreaks,
    loadAchievements,
    handleError
  ]);
  
  return {
    weeklyData,
    monthlyData,
    habitDistribution,
    streaks,
    achievements,
    loading: isLoading,
    error,
    clearError,
    loadWeeklyData,
    loadMonthlyData,
    loadHabitDistribution,
    loadStreaks,
    loadAchievements,
    loadAllProgressData
  };
}

export default useProgress;