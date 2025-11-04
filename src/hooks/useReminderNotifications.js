import { useEffect, useState } from 'react';
import { useReminders } from './useReminders';
import { useAuth } from '../firebase/AuthContext';
import notificationManager from '../services/notificationManager';

/**
 * Custom hook to manage browser notifications for reminders
 * @returns {Object} Notification permission and control functions
 */
export function useReminderNotifications() {
  const { activeReminders } = useReminders();
  const { currentUser } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  // Check if notifications are supported
  useEffect(() => {
    const supported = 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Set user ID in notification manager when user changes
  useEffect(() => {
    if (currentUser) {
      notificationManager.setUserId(currentUser.uid);
    }
  }, [currentUser]);

  // Request notification permission
  const requestPermission = async () => {
    const permission = await notificationManager.requestPermission();
    setNotificationPermission(permission);
    return permission;
  };

  // Load and schedule reminders when they change
  useEffect(() => {
    if (notificationPermission === 'granted' && activeReminders.length > 0) {
      notificationManager.loadReminders(activeReminders);
    }

    // Cleanup on unmount
    return () => {
      // Don't clear notifications on unmount, they should persist
      // Only clear when user explicitly disables them
    };
  }, [activeReminders, notificationPermission]);

  // Test notification function
  const sendTestNotification = () => {
    notificationManager.showNotification(
      'Test Notification',
      {
        body: 'This is a test notification from HabitVault!',
        icon: '/habitvault-icon-192x192.png'
      }
    );
  };

  return {
    isSupported,
    notificationPermission,
    requestPermission,
    sendTestNotification,
    hasPermission: notificationPermission === 'granted'
  };
}

export default useReminderNotifications;
