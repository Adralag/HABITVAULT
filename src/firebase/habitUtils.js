import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Habits collection reference
const habitsCollectionRef = (userId) => collection(db, 'users', userId, 'habits');

// Add a new habit
export const addHabit = async (userId, habitData) => {
  try {
    const newHabitData = {
      ...habitData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: userId,
      streak: 0,
      totalCompletions: 0,
      lastCompletedDate: null,
      status: 'active', // Set default status to active
      completedToday: false // Add completedToday field
    };
    
    const docRef = await addDoc(habitsCollectionRef(userId), newHabitData);
    return { id: docRef.id, ...newHabitData };
  } catch (error) {
    console.error("Error adding habit: ", error);
    throw error;
  }
};

// Get all habits for a user
export const getUserHabits = async (userId) => {
  try {
    const q = query(
      habitsCollectionRef(userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting habits: ", error);
    throw error;
  }
};

// Get a single habit by ID
export const getHabit = async (userId, habitId) => {
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    
    if (habitDoc.exists()) {
      return {
        id: habitDoc.id,
        ...habitDoc.data()
      };
    } else {
      throw new Error("Habit doesn't exist");
    }
  } catch (error) {
    console.error("Error getting habit: ", error);
    throw error;
  }
};

// Update a habit
export const updateHabit = async (userId, habitId, habitData) => {
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    
    await updateDoc(habitRef, {
      ...habitData,
      updatedAt: serverTimestamp()
    });
    
    // Return the updated habit
    return getHabit(userId, habitId);
  } catch (error) {
    console.error("Error updating habit: ", error);
    throw error;
  }
};

// Delete a habit
export const deleteHabit = async (userId, habitId) => {
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    await deleteDoc(habitRef);
    return true;
  } catch (error) {
    console.error("Error deleting habit: ", error);
    throw error;
  }
};

// Mark habit as completed for today
export const completeHabitForToday = async (userId, habitId) => {
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    
    if (!habitDoc.exists()) {
      throw new Error("Habit doesn't exist");
    }
    
    const habitData = habitDoc.data();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastCompletedDate = habitData.lastCompletedDate ? 
      new Date(habitData.lastCompletedDate.seconds * 1000) : null;
    
    // Set hours to 0 for date comparison
    if (lastCompletedDate) {
      lastCompletedDate.setHours(0, 0, 0, 0);
    }
    
    // Check if already completed today
    if (lastCompletedDate && lastCompletedDate.getTime() === today.getTime()) {
      throw new Error("Habit already completed today");
    }
    
    // Calculate streak
    let newStreak = habitData.streak || 0;
    
    // If last completed was yesterday, increase streak
    if (lastCompletedDate) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompletedDate.getTime() === yesterday.getTime()) {
        newStreak += 1;
      } else if (lastCompletedDate < yesterday) {
        // Streak broken
        newStreak = 1;
      }
    } else {
      // First completion
      newStreak = 1;
    }
    
    // Update habit
    await updateDoc(habitRef, {
      lastCompletedDate: new Date(),
      streak: newStreak,
      totalCompletions: (habitData.totalCompletions || 0) + 1,
      updatedAt: serverTimestamp(),
      completedToday: true // Mark as completed for today
    });
    
    // Return the updated habit
    return getHabit(userId, habitId);
  } catch (error) {
    console.error("Error completing habit: ", error);
    throw error;
  }
};

// Get habit statistics for a user
export const getHabitStats = async (userId) => {
  try {
    const habits = await getUserHabits(userId);
    
    return {
      totalHabits: habits.length,
      completedToday: habits.filter(habit => {
        if (!habit.lastCompletedDate) return false;
        
        const lastCompletedDate = new Date(habit.lastCompletedDate.seconds * 1000);
        const today = new Date();
        
        return lastCompletedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
      }).length,
      totalCompletions: habits.reduce((sum, habit) => sum + (habit.totalCompletions || 0), 0),
      longestStreak: habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0)
    };
  } catch (error) {
    console.error("Error getting habit stats: ", error);
    throw error;
  }
};