import { 
  collection,
  doc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { handleFirebaseError } from './firebaseErrorUtils';

/**
 * Get real-time updates of habits for a user
 * @param {string} userId - User ID
 * @param {function} callback - Callback function to handle habit updates
 * @returns {function} - Unsubscribe function to stop listening
 */
export const subscribeToHabits = (userId, callback) => {
  if (!userId) {
    const error = new Error('User ID is required to subscribe to habits');
    error.code = 'habits/missing-user-id';
    const standardError = handleFirebaseError(error, false, 'HabitSubscription');
    callback([], standardError);
    return () => {};
  }

  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    const q = query(habitsRef, orderBy('createdAt', 'desc'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(habits);
    }, (error) => {
      const standardError = handleFirebaseError(error, false, 'HabitSubscription');
      callback([], standardError);
    });
    
    return unsubscribe;
  } catch (error) {
    const standardError = handleFirebaseError(error, false, 'HabitSubscription');
    callback([], standardError);
    return () => {};
  }
};

/**
 * Get habits by category
 * @param {string} userId - User ID
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} - Array of habits
 */
export const getHabitsByCategory = async (userId, category) => {
  if (!userId) {
    const error = new Error('User ID is required');
    error.code = 'habits/missing-user-id';
    throw handleFirebaseError(error, false, 'GetHabitsByCategory').originalError;
  }
  
  if (!category) {
    const error = new Error('Category is required');
    error.code = 'habits/missing-category';
    throw handleFirebaseError(error, false, 'GetHabitsByCategory').originalError;
  }

  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    const q = query(
      habitsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetHabitsByCategory').originalError;
  }
};

/**
 * Get habits by status (active, archived, completed)
 * @param {string} userId - User ID
 * @param {string} status - Status to filter by
 * @returns {Promise<Array>} - Array of habits
 */
export const getHabitsByStatus = async (userId, status = 'active') => {
  if (!userId) {
    const error = new Error('User ID is required');
    error.code = 'habits/missing-user-id';
    throw handleFirebaseError(error, false, 'GetHabitsByStatus').originalError;
  }

  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    // Remove orderBy to avoid index issues
    const q = query(
      habitsRef, 
      where('status', '==', status)
    );
    
    const snapshot = await getDocs(q);
    const habits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort in memory instead of using orderBy
    return habits.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetHabitsByStatus').originalError;
  }
};

/**
 * Get recent habits
 * @param {string} userId - User ID
 * @param {number} count - Number of habits to fetch
 * @returns {Promise<Array>} - Array of habits
 */
export const getRecentHabits = async (userId, count = 5) => {
  if (!userId) {
    const error = new Error('User ID is required');
    error.code = 'habits/missing-user-id';
    throw handleFirebaseError(error, false, 'GetRecentHabits').originalError;
  }

  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    const q = query(
      habitsRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetRecentHabits').originalError;
  }
};

/**
 * Get habits that need attention (missed for several days)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of habits
 */
export const getHabitsNeedingAttention = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    const q = query(
      habitsRef,
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    
    // Filter habits that have been missed for 3 or more days
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(habit => {
        if (!habit.lastCompletedDate) return true; // Never completed
        
        const lastCompleted = new Date(habit.lastCompletedDate.seconds * 1000);
        lastCompleted.setHours(0, 0, 0, 0); // Start of that day
        
        // Calculate days since last completion
        const diffTime = now.getTime() - lastCompleted.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 3; // 3 or more days
      });
  } catch (error) {
    console.error('Error getting habits needing attention:', error);
    throw error;
  }
};

/**
 * Track habit completion for a specific date
 * @param {string} userId - User ID
 * @param {string} habitId - Habit ID
 * @param {Date} date - Date to mark as completed
 * @returns {Promise<Object>} - Updated habit
 */
export const trackHabitCompletion = async (userId, habitId, date = new Date()) => {
  if (!userId) throw new Error('User ID is required');
  if (!habitId) throw new Error('Habit ID is required');
  
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    
    if (!habitDoc.exists()) {
      throw new Error('Habit not found');
    }
    
    const habitData = habitDoc.data();
    const completionsCollection = collection(habitRef, 'completions');
    
    // Format the date to a string for easy lookup (YYYY-MM-DD)
    const dateString = date.toISOString().split('T')[0];
    
    // Add completion record
    await addDoc(completionsCollection, {
      date: date,
      dateString: dateString,
      createdAt: serverTimestamp()
    });
    
    // Update the habit with latest completion
    let streak = habitData.streak || 0;
    const lastCompletedDate = habitData.lastCompletedDate 
      ? new Date(habitData.lastCompletedDate.seconds * 1000) 
      : null;
    
    // Calculate streak
    if (lastCompletedDate) {
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const lastCompletedDay = new Date(lastCompletedDate);
      lastCompletedDay.setHours(0, 0, 0, 0);
      
      if (lastCompletedDay.getTime() === yesterday.getTime()) {
        // Completed yesterday, increase streak
        streak += 1;
      } else if (lastCompletedDay.getTime() < yesterday.getTime()) {
        // Missed days, reset streak
        streak = 1;
      }
    } else {
      // First completion
      streak = 1;
    }
    
    const updates = {
      lastCompletedDate: date,
      streak: streak,
      totalCompletions: (habitData.totalCompletions || 0) + 1,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(habitRef, updates);
    
    // Get updated habit
    const updatedHabit = await getDoc(habitRef);
    return {
      id: updatedHabit.id,
      ...updatedHabit.data()
    };
  } catch (error) {
    console.error('Error tracking habit completion:', error);
    throw error;
  }
};

/**
 * Get habit completion history for a specific habit
 * @param {string} userId - User ID
 * @param {string} habitId - Habit ID
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} - Array of completion records
 */
export const getHabitCompletionHistory = async (userId, habitId, days = 30) => {
  if (!userId) throw new Error('User ID is required');
  if (!habitId) throw new Error('Habit ID is required');
  
  try {
    const completionsRef = collection(
      db, 
      'users', 
      userId, 
      'habits', 
      habitId, 
      'completions'
    );
    
    // Calculate date from 'days' ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      completionsRef,
      where('date', '>=', startDate),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting habit completion history:', error);
    throw error;
  }
};

/**
 * Get habit streak data (for all user's habits)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Streak data
 */
export const getHabitStreakData = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    const snapshot = await getDocs(habitsRef);
    
    const habits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate stats
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.status === 'active').length;
    const totalCompletions = habits.reduce((sum, habit) => sum + (habit.totalCompletions || 0), 0);
    const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0);
    
    // Get current streaks for all habits
    const currentStreaks = habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      streak: habit.streak || 0,
      lastCompleted: habit.lastCompletedDate ? new Date(habit.lastCompletedDate.seconds * 1000) : null
    }));
    
    // Sort by streak (highest first)
    currentStreaks.sort((a, b) => b.streak - a.streak);
    
    return {
      totalHabits,
      activeHabits,
      totalCompletions,
      longestStreak,
      currentStreaks
    };
  } catch (error) {
    console.error('Error getting habit streak data:', error);
    throw error;
  }
};

/**
 * Archive a habit
 * @param {string} userId - User ID
 * @param {string} habitId - Habit ID
 * @returns {Promise<boolean>} - Success status
 */
export const archiveHabit = async (userId, habitId) => {
  if (!userId) throw new Error('User ID is required');
  if (!habitId) throw new Error('Habit ID is required');
  
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    
    await updateDoc(habitRef, {
      status: 'archived',
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error archiving habit:', error);
    throw error;
  }
};

/**
 * Restore an archived habit
 * @param {string} userId - User ID
 * @param {string} habitId - Habit ID
 * @returns {Promise<boolean>} - Success status
 */
export const restoreHabit = async (userId, habitId) => {
  if (!userId) throw new Error('User ID is required');
  if (!habitId) throw new Error('Habit ID is required');
  
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    
    await updateDoc(habitRef, {
      status: 'active',
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error restoring habit:', error);
    throw error;
  }
};