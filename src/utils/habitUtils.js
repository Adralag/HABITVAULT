/**
 * Calculate the completion rate of habits
 * @param {Array} habits - Array of habits
 * @param {number} days - Number of days to consider (defaults to 7)
 * @returns {number} - Completion rate as percentage
 */
export const calculateCompletionRate = (habits, days = 7) => {
  if (!habits || habits.length === 0) {
    return 0;
  }

  // Only consider active habits
  const activeHabits = habits.filter(habit => habit.status === 'active');
  if (activeHabits.length === 0) {
    return 0;
  }

  // Count completed habits
  const completedCount = activeHabits.filter(habit => habit.completedToday).length;
  const percentage = Math.round((completedCount / activeHabits.length) * 100);
  
  return percentage;
};

/**
 * Get the current streak for a habit
 * @param {Object} habit - Habit object
 * @returns {number} - Current streak
 */
export const getCurrentStreak = (habit) => {
  return habit.streak || 0;
};

/**
 * Check if a habit is due today
 * @param {Object} habit - Habit object
 * @returns {boolean} - Whether the habit is due today
 */
export const isDueToday = (habit) => {
  if (!habit.frequency) {
    return true; // Default to daily if no frequency is specified
  }

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Map day of week to frequency property
  const dayMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  
  // Check if today is included in the habit's frequency
  return habit.frequency[dayMap[dayOfWeek]];
};

/**
 * Format a streak number with appropriate suffix
 * @param {number} streak - Streak number
 * @returns {string} - Formatted streak with suffix
 */
export const formatStreak = (streak) => {
  if (streak === 0) {
    return '0 days';
  }
  
  if (streak === 1) {
    return '1 day';
  }
  
  return `${streak} days`;
};

/**
 * Calculate the progress percentage for a habit
 * @param {Object} habit - Habit object
 * @returns {number} - Progress as percentage
 */
export const calculateProgress = (habit) => {
  if (habit.completedToday) {
    return 100;
  }
  
  return 0;
};

/**
 * Group habits by category
 * @param {Array} habits - Array of habits
 * @returns {Object} - Object with categories as keys and arrays of habits as values
 */
export const groupByCategory = (habits) => {
  if (!habits || habits.length === 0) {
    return {};
  }
  
  return habits.reduce((acc, habit) => {
    const category = habit.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {});
};

export default {
  calculateCompletionRate,
  getCurrentStreak,
  isDueToday,
  formatStreak,
  calculateProgress,
  groupByCategory
};