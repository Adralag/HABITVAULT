/**
 * Notification Manager Service
 * Handles browser notifications and reminder scheduling
 */

import { createNotification } from '../firebase/notificationServices';

class NotificationManager {
  constructor() {
    this.permission = 'default';
    this.scheduledNotifications = new Map();
    this.currentUserId = null;
    this.checkPermission();
  }

  /**
   * Set current user ID for creating Firebase notifications
   * @param {string} userId - User ID
   */
  setUserId(userId) {
    this.currentUserId = userId;
  }

  /**
   * Check current notification permission
   */
  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from user
   * @returns {Promise<string>} Permission status
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Show a browser notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @returns {Notification|null} Notification instance
   */
  async showNotification(title, options = {}) {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const defaultOptions = {
      icon: '/habitvault-icon-192x192.png',
      badge: '/habitvault-icon-192x192.png',
      vibrate: [200, 100, 200],
      tag: 'habitvault-reminder',
      requireInteraction: false,
      ...options
    };

    try {
      // Create browser notification
      const notification = new Notification(title, defaultOptions);
      
      // Create Firebase notification for history
      if (this.currentUserId) {
        await createNotification(this.currentUserId, {
          type: options.data?.type || 'reminder',
          title: title,
          message: options.body || '',
          habitId: options.data?.habitId || null,
          priority: 'medium'
        }).catch(err => {
          console.error('Failed to create Firebase notification:', err);
          // Don't throw - browser notification should still show
        });
      }
      
      // Add click handler to focus the app
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // If there's a URL in the data, navigate to it
        if (options.data && options.data.url) {
          window.location.href = options.data.url;
        }
      };

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Schedule a notification for a specific time
   * @param {string} id - Unique identifier for the notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @param {Date} time - Time to show the notification
   */
  scheduleNotification(id, title, options, time) {
    // Cancel existing notification with same ID
    this.cancelScheduledNotification(id);

    const now = new Date();
    const delay = time.getTime() - now.getTime();

    if (delay <= 0) {
      // Time has already passed, show immediately
      this.showNotification(title, options);
      return;
    }

    // Schedule the notification
    const timeoutId = setTimeout(() => {
      this.showNotification(title, options);
      this.scheduledNotifications.delete(id);
    }, delay);

    this.scheduledNotifications.set(id, {
      timeoutId,
      title,
      options,
      time
    });
  }

  /**
   * Cancel a scheduled notification
   * @param {string} id - Notification ID
   */
  cancelScheduledNotification(id) {
    const scheduled = this.scheduledNotifications.get(id);
    if (scheduled) {
      clearTimeout(scheduled.timeoutId);
      this.scheduledNotifications.delete(id);
    }
  }

  /**
   * Schedule recurring notifications based on reminder data
   * @param {Object} reminder - Reminder object
   */
  scheduleReminderNotifications(reminder) {
    if (!reminder.active) {
      this.cancelScheduledNotification(reminder.id);
      return;
    }

    const scheduleForToday = () => {
      const now = new Date();
      const [hours, minutes] = reminder.time.split(':');
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Only schedule if the time hasn't passed today
      if (scheduledTime > now) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = dayNames[now.getDay()];

        // Check if today is in the reminder's days
        if (reminder.days && reminder.days.includes(today)) {
          this.scheduleNotification(
            `${reminder.id}-${scheduledTime.getTime()}`,
            reminder.title,
            {
              body: reminder.message,
              data: {
                reminderId: reminder.id,
                habitId: reminder.habitId,
                url: reminder.habitId ? `/habits/${reminder.habitId}` : '/notifications'
              }
            },
            scheduledTime
          );
        }
      }
    };

    // Schedule for today
    scheduleForToday();

    // Schedule a daily check at midnight to set up tomorrow's notifications
    const scheduleNextDay = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const delay = tomorrow.getTime() - now.getTime();

      setTimeout(() => {
        scheduleForToday();
        scheduleNextDay(); // Recursively schedule for the next day
      }, delay);
    };

    scheduleNextDay();
  }

  /**
   * Load and schedule all active reminders
   * @param {Array} reminders - Array of reminder objects
   */
  loadReminders(reminders) {
    // Clear all existing scheduled notifications
    this.scheduledNotifications.forEach((_, id) => {
      this.cancelScheduledNotification(id);
    });

    // Schedule all active reminders
    reminders.forEach(reminder => {
      if (reminder.active) {
        this.scheduleReminderNotifications(reminder);
      }
    });
  }

  /**
   * Clear all scheduled notifications
   */
  clearAll() {
    this.scheduledNotifications.forEach((_, id) => {
      this.cancelScheduledNotification(id);
    });
  }
}

// Export singleton instance
const notificationManager = new NotificationManager();
export default notificationManager;
