import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as notificationServices from '../firebase/notificationServices';
import useFirebaseOperation from './useFirebaseOperation';

/**
 * Custom hook for managing user notifications
 * @returns {Object} Notification related data and functions
 */
export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  // Use Firebase operation hook for handling loading states and errors
  const {
    isLoading,
    error,
    clearError,
    handleError,
    executeOperation
  } = useFirebaseOperation('Notifications');
  
  // Subscribe to notifications when component mounts
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoadingInitial(false);
      return () => {};
    }
    
    setIsLoadingInitial(true);
    
    const unsubscribe = notificationServices.subscribeToNotifications(
      currentUser.uid,
      (notificationsData, err) => {
        if (err) {
          handleError(err);
        } else {
          setNotifications(notificationsData);
          // Count unread notifications
          const unread = notificationsData.filter(notification => !notification.read).length;
          setUnreadCount(unread);
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
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<boolean>} - Success status
   */
  const markAsRead = useCallback(async (notificationId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await notificationServices.markNotificationAsRead(
        currentUser.uid, 
        notificationId
      );
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth, handleError]);
  
  /**
   * Mark all notifications as read
   * @returns {Promise<boolean>} - Success status
   */
  const markAllAsRead = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await notificationServices.markAllNotificationsAsRead(
        currentUser.uid
      );
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth, handleError]);
  
  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<boolean>} - Success status
   */
  const deleteNotification = useCallback(async (notificationId) => {
    const authError = checkAuth();
    if (authError) {
      throw handleError(authError);
    }
    
    return executeOperation(async () => {
      return await notificationServices.deleteNotification(
        currentUser.uid, 
        notificationId
      );
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth, handleError]);

  // Combine initial loading state with operation loading state
  const loading = isLoadingInitial || isLoading;
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    clearError,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}

export default useNotifications;