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
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { handleFirebaseError } from './firebaseErrorUtils';

/**
 * Get real-time updates of notifications for a user
 * @param {string} userId - User ID
 * @param {function} callback - Callback function to handle notification updates
 * @returns {function} - Unsubscribe function to stop listening
 */
export const subscribeToNotifications = (userId, callback) => {
  if (!userId) {
    const error = new Error('User ID is required to subscribe to notifications');
    error.code = 'notifications/missing-user-id';
    const standardError = handleFirebaseError(error, false, 'NotificationSubscription');
    callback([], standardError);
    return () => {};
  }

  try {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(20));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(notifications);
    }, (error) => {
      const standardError = handleFirebaseError(error, false, 'NotificationSubscription');
      callback([], standardError);
    });
    
    return unsubscribe;
  } catch (error) {
    const standardError = handleFirebaseError(error, false, 'NotificationSubscription');
    callback([], standardError);
    return () => {};
  }
};

/**
 * Create a new notification
 * @param {string} userId - User ID
 * @param {object} notification - Notification data
 * @returns {Promise<object>} - Created notification
 */
export const createNotification = async (userId, notification) => {
  if (!userId) throw new Error('User ID is required');
  if (!notification) throw new Error('Notification data is required');
  
  try {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    
    const notificationData = {
      ...notification,
      read: false,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(notificationsRef, notificationData);
    const newNotification = await getDoc(docRef);
    
    return {
      id: newNotification.id,
      ...newNotification.data()
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} userId - User ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} - Success status
 */
export const markNotificationAsRead = async (userId, notificationId) => {
  if (!userId) throw new Error('User ID is required');
  if (!notificationId) throw new Error('Notification ID is required');
  
  try {
    const notificationRef = doc(db, 'users', userId, 'notifications', notificationId);
    
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
export const markAllNotificationsAsRead = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const snapshot = await getDocs(q);
    
    // Use batch to update all unread notifications
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 * @param {string} userId - User ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteNotification = async (userId, notificationId) => {
  if (!userId) throw new Error('User ID is required');
  if (!notificationId) throw new Error('Notification ID is required');
  
  try {
    const notificationRef = doc(db, 'users', userId, 'notifications', notificationId);
    
    await deleteDoc(notificationRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Create a habit reminder notification
 * @param {string} userId - User ID
 * @param {object} habit - Habit data
 * @returns {Promise<object>} - Created notification
 */
export const createHabitReminderNotification = async (userId, habit) => {
  if (!userId) throw new Error('User ID is required');
  if (!habit) throw new Error('Habit data is required');
  
  try {
    const notification = {
      type: 'reminder',
      title: `Don't forget: ${habit.name}`,
      message: `It's time to complete your "${habit.name}" habit.`,
      habitId: habit.id,
      read: false,
      priority: 'medium'
    };
    
    return await createNotification(userId, notification);
  } catch (error) {
    console.error('Error creating habit reminder notification:', error);
    throw error;
  }
};

/**
 * Create a missed habit notification
 * @param {string} userId - User ID
 * @param {object} habit - Habit data
 * @param {number} days - Days missed
 * @returns {Promise<object>} - Created notification
 */
export const createMissedHabitNotification = async (userId, habit, days) => {
  if (!userId) throw new Error('User ID is required');
  if (!habit) throw new Error('Habit data is required');
  
  try {
    const notification = {
      type: 'missed',
      title: `Missed: ${habit.name}`,
      message: `You haven't completed "${habit.name}" for ${days} day${days > 1 ? 's' : ''}.`,
      habitId: habit.id,
      read: false,
      priority: 'high'
    };
    
    return await createNotification(userId, notification);
  } catch (error) {
    console.error('Error creating missed habit notification:', error);
    throw error;
  }
};

/**
 * Create a streak milestone notification
 * @param {string} userId - User ID
 * @param {object} habit - Habit data
 * @returns {Promise<object>} - Created notification
 */
export const createStreakMilestoneNotification = async (userId, habit) => {
  if (!userId) throw new Error('User ID is required');
  if (!habit) throw new Error('Habit data is required');
  
  try {
    const notification = {
      type: 'achievement',
      title: `Streak Milestone: ${habit.name}`,
      message: `Congratulations! You've maintained your "${habit.name}" habit for ${habit.streak} days in a row!`,
      habitId: habit.id,
      read: false,
      priority: 'low'
    };
    
    return await createNotification(userId, notification);
  } catch (error) {
    console.error('Error creating streak milestone notification:', error);
    throw error;
  }
};