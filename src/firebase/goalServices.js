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
 * Get real-time updates of goals for a user
 * @param {string} userId - User ID
 * @param {function} callback - Callback function to handle goal updates
 * @returns {function} - Unsubscribe function to stop listening
 */
export const subscribeToGoals = (userId, callback) => {
  if (!userId) {
    const error = new Error('User ID is required to subscribe to goals');
    error.code = 'goals/missing-user-id';
    const standardError = handleFirebaseError(error, false, 'GoalSubscription');
    callback([], standardError);
    return () => {};
  }

  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const q = query(goalsRef, orderBy('createdAt', 'desc'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(goals);
    }, (error) => {
      const standardError = handleFirebaseError(error, false, 'GoalSubscription');
      callback([], standardError);
    });
    
    return unsubscribe;
  } catch (error) {
    const standardError = handleFirebaseError(error, false, 'GoalSubscription');
    callback([], standardError);
    return () => {};
  }
};

/**
 * Add a new goal
 * @param {string} userId - User ID
 * @param {Object} goalData - Goal data
 * @returns {Promise<Object>} - New goal
 */
export const addGoal = async (userId, goalData) => {
  if (!userId) throw new Error('User ID is required');
  if (!goalData) throw new Error('Goal data is required');
  
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    
    // Add timestamp
    const goal = {
      ...goalData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      progress: goalData.progress || 0,
      currentStreak: goalData.currentStreak || 0,
      longestStreak: goalData.longestStreak || 0,
      status: goalData.status || 'active'
    };
    
    const docRef = await addDoc(goalsRef, goal);
    
    // Get the newly created goal
    const newGoal = await getDoc(docRef);
    return {
      id: newGoal.id,
      ...newGoal.data()
    };
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
};

/**
 * Update a goal
 * @param {string} userId - User ID
 * @param {string} goalId - Goal ID
 * @param {Object} goalData - Updated goal data
 * @returns {Promise<Object>} - Updated goal
 */
export const updateGoal = async (userId, goalId, goalData) => {
  if (!userId) throw new Error('User ID is required');
  if (!goalId) throw new Error('Goal ID is required');
  if (!goalData) throw new Error('Goal data is required');
  
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    
    // Update timestamp
    const updates = {
      ...goalData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(goalRef, updates);
    
    // Get the updated goal
    const updatedGoal = await getDoc(goalRef);
    return {
      id: updatedGoal.id,
      ...updatedGoal.data()
    };
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

/**
 * Delete a goal
 * @param {string} userId - User ID
 * @param {string} goalId - Goal ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteGoal = async (userId, goalId) => {
  if (!userId) throw new Error('User ID is required');
  if (!goalId) throw new Error('Goal ID is required');
  
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    await deleteDoc(goalRef);
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

/**
 * Get a goal by ID
 * @param {string} userId - User ID
 * @param {string} goalId - Goal ID
 * @returns {Promise<Object>} - Goal object
 */
export const getGoalById = async (userId, goalId) => {
  if (!userId) throw new Error('User ID is required');
  if (!goalId) throw new Error('Goal ID is required');
  
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    const goalDoc = await getDoc(goalRef);
    
    if (!goalDoc.exists()) {
      throw new Error('Goal not found');
    }
    
    return {
      id: goalDoc.id,
      ...goalDoc.data()
    };
  } catch (error) {
    console.error('Error getting goal by ID:', error);
    throw error;
  }
};

/**
 * Get all goals for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of goals
 */
export const getAllGoals = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const q = query(goalsRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all goals:', error);
    throw error;
  }
};

/**
 * Get goals by status (active, completed, archived)
 * @param {string} userId - User ID
 * @param {string} status - Status to filter by
 * @returns {Promise<Array>} - Array of goals
 */
export const getGoalsByStatus = async (userId, status = 'active') => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const q = query(
      goalsRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting goals by status:', error);
    throw error;
  }
};

/**
 * Get goals by associated habit ID
 * @param {string} userId - User ID
 * @param {string} habitId - Habit ID
 * @returns {Promise<Array>} - Array of goals
 */
export const getGoalsByHabitId = async (userId, habitId) => {
  if (!userId) throw new Error('User ID is required');
  if (!habitId) throw new Error('Habit ID is required');
  
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const q = query(
      goalsRef, 
      where('habitId', '==', habitId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting goals by habit ID:', error);
    throw error;
  }
};

/**
 * Update goal progress
 * @param {string} userId - User ID
 * @param {string} goalId - Goal ID
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise<Object>} - Updated goal
 */
export const updateGoalProgress = async (userId, goalId, progress) => {
  if (!userId) throw new Error('User ID is required');
  if (!goalId) throw new Error('Goal ID is required');
  if (progress < 0 || progress > 100) throw new Error('Progress must be between 0 and 100');
  
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    
    await updateDoc(goalRef, {
      progress: progress,
      updatedAt: serverTimestamp(),
      // If progress is 100%, mark as completed
      ...(progress === 100 ? { status: 'completed' } : {})
    });
    
    // Get the updated goal
    const updatedGoal = await getDoc(goalRef);
    return {
      id: updatedGoal.id,
      ...updatedGoal.data()
    };
  } catch (error) {
    console.error('Error updating goal progress:', error);
    throw error;
  }
};

/**
 * Get achievement stats for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Achievement stats
 */
export const getAchievementStats = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    // Get all habits for streak data
    const habitsRef = collection(db, 'users', userId, 'habits');
    const habitsSnapshot = await getDocs(habitsRef);
    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get completed goals
    const goalsRef = collection(db, 'users', userId, 'goals');
    const goalsQuery = query(goalsRef, where('status', '==', 'completed'));
    const goalsSnapshot = await getDocs(goalsQuery);
    const completedGoals = goalsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate longest streak across all habits
    const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0);
    
    // Calculate total completions across all habits
    const totalCompletions = habits.reduce((sum, habit) => sum + (habit.totalCompletions || 0), 0);
    
    // Count completed goals
    const goalsAchieved = completedGoals.length;
    
    return {
      longestStreak,
      totalCompletions,
      goalsAchieved
    };
  } catch (error) {
    console.error('Error getting achievement stats:', error);
    throw error;
  }
};