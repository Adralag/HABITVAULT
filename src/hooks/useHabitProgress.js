import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as habitServices from '../firebase/habitServices';

/**
 * Custom hook for tracking habit progress and streaks
 * @returns {Object} - Progress and streak data
 */
export function useHabitProgress() {
  const { currentUser } = useAuth();
  const [progressData, setProgressData] = useState({
    totalHabits: 0,
    activeHabits: 0,
    totalCompletions: 0,
    longestStreak: 0,
    currentStreaks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch streak data
  const fetchStreakData = useCallback(async () => {
    if (!currentUser) {
      setProgressData({
        totalHabits: 0,
        activeHabits: 0,
        totalCompletions: 0,
        longestStreak: 0,
        currentStreaks: []
      });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await habitServices.getHabitStreakData(currentUser.uid);
      setProgressData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching streak data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  // Fetch streak data on mount and user change
  useEffect(() => {
    fetchStreakData();
  }, [fetchStreakData]);
  
  /**
   * Get habit completion history
   * @param {string} habitId - Habit ID
   * @param {number} days - Number of days to look back
   * @returns {Promise<Array>} - Completion history
   */
  const getHabitHistory = async (habitId, days = 30) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      return await habitServices.getHabitCompletionHistory(
        currentUser.uid,
        habitId,
        days
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  /**
   * Get habits that need attention
   * @returns {Promise<Array>} - Habits needing attention
   */
  const getHabitsNeedingAttention = async () => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      return await habitServices.getHabitsNeedingAttention(currentUser.uid);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  return {
    progressData,
    loading,
    error,
    refreshProgress: fetchStreakData,
    getHabitHistory,
    getHabitsNeedingAttention
  };
}