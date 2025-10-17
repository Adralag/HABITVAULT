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
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { handleFirebaseError } from './firebaseErrorUtils';

/**
 * Subscribe to reminders for a user
 * @param {string} userId - User ID
 * @param {function} callback - Callback function for reminders data and errors
 * @returns {function} - Unsubscribe function
 */
export const subscribeToReminders = (userId, callback) => {
  if (!userId) {
    const error = new Error('User ID is required to subscribe to reminders');
    error.code = 'reminders/missing-user-id';
    const standardError = handleFirebaseError(error, false, 'ReminderSubscription');
    callback([], standardError);
    return () => {};
  }

  try {
    const remindersRef = collection(db, 'users', userId, 'reminders');
    const q = query(remindersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reminders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(reminders);
    }, (error) => {
      const standardError = handleFirebaseError(error, false, 'ReminderSubscription');
      callback([], standardError);
    });
    
    return unsubscribe;
  } catch (error) {
    const standardError = handleFirebaseError(error, false, 'ReminderSubscription');
    callback([], standardError);
    return () => {};
  }
};

/**
 * Create a new reminder
 * @param {string} userId - User ID
 * @param {object} reminderData - Reminder data
 * @returns {Promise<object>} - Created reminder
 */
export const createReminder = async (userId, reminderData) => {
  if (!userId) throw new Error('User ID is required');
  if (!reminderData) throw new Error('Reminder data is required');
  
  try {
    const remindersRef = collection(db, 'users', userId, 'reminders');
    
    const reminder = {
      ...reminderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: reminderData.active !== undefined ? reminderData.active : true
    };
    
    const docRef = await addDoc(remindersRef, reminder);
    const newReminder = await getDoc(docRef);
    
    return {
      id: newReminder.id,
      ...newReminder.data()
    };
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

/**
 * Update an existing reminder
 * @param {string} userId - User ID
 * @param {string} reminderId - Reminder ID
 * @param {object} reminderData - Updated reminder data
 * @returns {Promise<object>} - Updated reminder
 */
export const updateReminder = async (userId, reminderId, reminderData) => {
  if (!userId) throw new Error('User ID is required');
  if (!reminderId) throw new Error('Reminder ID is required');
  if (!reminderData) throw new Error('Reminder data is required');
  
  try {
    const reminderRef = doc(db, 'users', userId, 'reminders', reminderId);
    
    const updates = {
      ...reminderData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(reminderRef, updates);
    
    const updatedReminder = await getDoc(reminderRef);
    
    return {
      id: updatedReminder.id,
      ...updatedReminder.data()
    };
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

/**
 * Toggle the active status of a reminder
 * @param {string} userId - User ID
 * @param {string} reminderId - Reminder ID
 * @returns {Promise<object>} - Updated reminder
 */
export const toggleReminderStatus = async (userId, reminderId) => {
  if (!userId) throw new Error('User ID is required');
  if (!reminderId) throw new Error('Reminder ID is required');
  
  try {
    const reminderRef = doc(db, 'users', userId, 'reminders', reminderId);
    const reminderDoc = await getDoc(reminderRef);
    
    if (!reminderDoc.exists()) {
      throw new Error('Reminder not found');
    }
    
    const reminderData = reminderDoc.data();
    const newActiveStatus = !reminderData.active;
    
    await updateDoc(reminderRef, {
      active: newActiveStatus,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: reminderDoc.id,
      ...reminderData,
      active: newActiveStatus
    };
  } catch (error) {
    console.error('Error toggling reminder status:', error);
    throw error;
  }
};

/**
 * Delete a reminder
 * @param {string} userId - User ID
 * @param {string} reminderId - Reminder ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteReminder = async (userId, reminderId) => {
  if (!userId) throw new Error('User ID is required');
  if (!reminderId) throw new Error('Reminder ID is required');
  
  try {
    const reminderRef = doc(db, 'users', userId, 'reminders', reminderId);
    
    await deleteDoc(reminderRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

/**
 * Get active reminders for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of active reminders
 */
export const getActiveReminders = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const remindersRef = collection(db, 'users', userId, 'reminders');
    const q = query(
      remindersRef,
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting active reminders:', error);
    throw error;
  }
};

/**
 * Get inactive reminders for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of inactive reminders
 */
export const getInactiveReminders = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const remindersRef = collection(db, 'users', userId, 'reminders');
    const q = query(
      remindersRef,
      where('active', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting inactive reminders:', error);
    throw error;
  }
};

/**
 * Get reminders for a specific habit
 * @param {string} userId - User ID
 * @param {string} habitId - Habit ID
 * @returns {Promise<Array>} - List of reminders for the habit
 */
export const getRemindersForHabit = async (userId, habitId) => {
  if (!userId) throw new Error('User ID is required');
  if (!habitId) throw new Error('Habit ID is required');
  
  try {
    const remindersRef = collection(db, 'users', userId, 'reminders');
    const q = query(
      remindersRef,
      where('habitId', '==', habitId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting reminders for habit:', error);
    throw error;
  }
};