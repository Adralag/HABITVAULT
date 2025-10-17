import { 
  collection,
  doc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { handleFirebaseError } from './firebaseErrorUtils';

/**
 * Get weekly habit completion data
 * @param {string} userId - User ID
 * @param {number} weeks - Number of weeks to look back (default: 1)
 * @returns {Promise<Object>} - Weekly completion data
 */
export const getWeeklyCompletionData = async (userId, weeks = 1) => {
  if (!userId) {
    const error = new Error('User ID is required');
    throw handleFirebaseError(error, false, 'GetWeeklyCompletionData').originalError;
  }

  try {
    // Get all active habits
    const habitsRef = collection(db, 'users', userId, 'habits');
    const habitsQuery = query(
      habitsRef,
      where('status', '==', 'active')
    );
    
    const habitsSnapshot = await getDocs(habitsQuery);
    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate date range for the specified weeks
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - (7 * weeks));
    startDate.setHours(0, 0, 0, 0); // Start of day
    
    // Weekly data structure
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = weekDays.map(name => ({
      name,
      completed: 0,
      target: 0
    }));

    // For each habit, get its completions within date range
    let totalTarget = 0;
    let totalCompleted = 0;
    
    for (const habit of habits) {
      // Skip habits that don't have a valid frequency
      if (!habit.frequency) continue;
      
      const completionsRef = collection(
        db, 
        'users', 
        userId, 
        'habits', 
        habit.id, 
        'completions'
      );
      
      const completionsQuery = query(
        completionsRef,
        where('date', '>=', startDate),
        orderBy('date', 'asc')
      );
      
      const completionsSnapshot = await getDocs(completionsQuery);
      const completions = completionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Parse dates to get day of week
      for (const completion of completions) {
        if (!completion.date) continue;
        
        const date = new Date(completion.date.seconds * 1000);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
        
        // Update the weekly data for this day
        weeklyData[dayOfWeek].completed += 1;
        totalCompleted += 1;
      }
      
      // Calculate target completions based on habit frequency
      switch (habit.frequency) {
        case 'Daily':
          // Daily habits should be completed every day
          for (let i = 0; i < 7; i++) {
            weeklyData[i].target += 1;
            totalTarget += 1;
          }
          break;
          
        case 'Weekdays':
          // Mon-Fri
          for (let i = 1; i <= 5; i++) {
            weeklyData[i].target += 1;
            totalTarget += 1;
          }
          break;
          
        case 'Weekends':
          // Sat-Sun
          weeklyData[0].target += 1; // Sunday
          weeklyData[6].target += 1; // Saturday
          totalTarget += 2;
          break;
          
        case 'Weekly':
          // Count once per week (we'll add to Monday)
          weeklyData[1].target += 1;
          totalTarget += 1;
          break;
          
        case 'Monthly':
          // Skip for weekly view
          break;
          
        default:
          // Custom frequencies (e.g., "3 times per week")
          const match = habit.frequency.match(/(\d+)\s+times?\s+per\s+week/i);
          if (match && match[1]) {
            const timesPerWeek = parseInt(match[1], 10);
            
            // Distribute evenly across weekdays
            if (timesPerWeek <= 7) {
              const interval = Math.floor(7 / timesPerWeek);
              for (let i = 0; i < timesPerWeek; i++) {
                const day = (i * interval) % 7;
                weeklyData[day].target += 1;
                totalTarget += 1;
              }
            }
          }
          break;
      }
    }
    
    // Rotate the array to start with Monday instead of Sunday if needed
    // Uncomment the following to start week with Monday
    // const sunday = weeklyData.shift();
    // weeklyData.push(sunday);
    
    return {
      weeklyData,
      totalTarget,
      totalCompleted,
      completionRate: totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0
    };
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetWeeklyCompletionData').originalError;
  }
};

/**
 * Get monthly habit completion data
 * @param {string} userId - User ID
 * @param {number} months - Number of months to look back (default: 6)
 * @returns {Promise<Object>} - Monthly completion data
 */
export const getMonthlyCompletionData = async (userId, months = 6) => {
  if (!userId) {
    const error = new Error('User ID is required');
    throw handleFirebaseError(error, false, 'GetMonthlyCompletionData').originalError;
  }

  try {
    // Get all active habits
    const habitsRef = collection(db, 'users', userId, 'habits');
    const habitsQuery = query(
      habitsRef,
      where('status', '==', 'active')
    );
    
    const habitsSnapshot = await getDocs(habitsQuery);
    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate date range for the specified months
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = [];
    
    // Initialize monthly data structure with past months
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(now.getMonth() - i);
      const monthIndex = monthDate.getMonth();
      
      monthlyData.push({
        name: monthNames[monthIndex],
        completed: 0,
        target: 0,
        month: monthIndex,
        year: monthDate.getFullYear()
      });
    }
    
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - months + 1);
    startDate.setDate(1); // First day of month
    startDate.setHours(0, 0, 0, 0); // Start of day
    
    // For each habit, get its completions within date range
    let totalTarget = 0;
    let totalCompleted = 0;
    
    for (const habit of habits) {
      // Skip habits that don't have a valid frequency
      if (!habit.frequency) continue;
      
      const completionsRef = collection(
        db, 
        'users', 
        userId, 
        'habits', 
        habit.id, 
        'completions'
      );
      
      const completionsQuery = query(
        completionsRef,
        where('date', '>=', startDate),
        orderBy('date', 'asc')
      );
      
      const completionsSnapshot = await getDocs(completionsQuery);
      const completions = completionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Calculate target completions per month based on habit frequency
      for (const monthData of monthlyData) {
        // Get days in this month
        const daysInMonth = new Date(monthData.year, monthData.month + 1, 0).getDate();
        const firstDayOfMonth = new Date(monthData.year, monthData.month, 1);
        const lastDayOfMonth = new Date(monthData.year, monthData.month, daysInMonth);
        
        // Calculate expected completions based on frequency
        let targetCompletions = 0;
        
        switch (habit.frequency) {
          case 'Daily':
            targetCompletions = daysInMonth;
            break;
            
          case 'Weekdays':
            // Count weekdays in this month
            let weekdaysCount = 0;
            for (let day = 1; day <= daysInMonth; day++) {
              const date = new Date(monthData.year, monthData.month, day);
              const dayOfWeek = date.getDay();
              if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Mon-Fri
                weekdaysCount++;
              }
            }
            targetCompletions = weekdaysCount;
            break;
            
          case 'Weekends':
            // Count weekends in this month
            let weekendsCount = 0;
            for (let day = 1; day <= daysInMonth; day++) {
              const date = new Date(monthData.year, monthData.month, day);
              const dayOfWeek = date.getDay();
              if (dayOfWeek === 0 || dayOfWeek === 6) { // Sat-Sun
                weekendsCount++;
              }
            }
            targetCompletions = weekendsCount;
            break;
            
          case 'Weekly':
            // Count weeks in this month (approximately)
            targetCompletions = Math.ceil(daysInMonth / 7);
            break;
            
          case 'Monthly':
            targetCompletions = 1;
            break;
            
          default:
            // Custom frequencies (e.g., "3 times per week")
            const weekMatch = habit.frequency.match(/(\d+)\s+times?\s+per\s+week/i);
            if (weekMatch && weekMatch[1]) {
              const timesPerWeek = parseInt(weekMatch[1], 10);
              const weeksInMonth = Math.ceil(daysInMonth / 7);
              targetCompletions = timesPerWeek * weeksInMonth;
            }
            
            const monthMatch = habit.frequency.match(/(\d+)\s+times?\s+per\s+month/i);
            if (monthMatch && monthMatch[1]) {
              targetCompletions = parseInt(monthMatch[1], 10);
            }
            break;
        }
        
        monthData.target += targetCompletions;
        totalTarget += targetCompletions;
      }
      
      // Count actual completions by month
      for (const completion of completions) {
        if (!completion.date) continue;
        
        const date = new Date(completion.date.seconds * 1000);
        const month = date.getMonth();
        const year = date.getFullYear();
        
        // Find matching month in our data
        const monthData = monthlyData.find(m => m.month === month && m.year === year);
        if (monthData) {
          monthData.completed += 1;
          totalCompleted += 1;
        }
      }
    }
    
    return {
      monthlyData,
      totalTarget,
      totalCompleted,
      completionRate: totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0
    };
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetMonthlyCompletionData').originalError;
  }
};

/**
 * Get habit distribution data (completion rate by habit)
 * @param {string} userId - User ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} - Habit distribution data
 */
export const getHabitDistributionData = async (userId, days = 30) => {
  if (!userId) {
    const error = new Error('User ID is required');
    throw handleFirebaseError(error, false, 'GetHabitDistributionData').originalError;
  }

  try {
    // Get all active habits
    const habitsRef = collection(db, 'users', userId, 'habits');
    const habitsQuery = query(
      habitsRef,
      where('status', '==', 'active')
    );
    
    const habitsSnapshot = await getDocs(habitsQuery);
    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    startDate.setHours(0, 0, 0, 0); // Start of day
    
    // Get completions for each habit and calculate rates
    const habitDistribution = [];
    
    for (const habit of habits) {
      // Calculate target completions based on frequency and period
      let targetCompletions = 0;
      
      switch (habit.frequency) {
        case 'Daily':
          targetCompletions = days;
          break;
          
        case 'Weekdays':
          // Calculate weekdays in the period
          let weekdaysCount = 0;
          for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const dayOfWeek = date.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Mon-Fri
              weekdaysCount++;
            }
          }
          targetCompletions = weekdaysCount;
          break;
          
        case 'Weekends':
          // Calculate weekends in the period
          let weekendsCount = 0;
          for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) { // Sat-Sun
              weekendsCount++;
            }
          }
          targetCompletions = weekendsCount;
          break;
          
        case 'Weekly':
          targetCompletions = Math.ceil(days / 7);
          break;
          
        case 'Monthly':
          targetCompletions = Math.ceil(days / 30);
          break;
          
        default:
          // Custom frequencies
          const weekMatch = habit.frequency.match(/(\d+)\s+times?\s+per\s+week/i);
          if (weekMatch && weekMatch[1]) {
            const timesPerWeek = parseInt(weekMatch[1], 10);
            const weeksInPeriod = Math.ceil(days / 7);
            targetCompletions = timesPerWeek * weeksInPeriod;
          }
          
          const monthMatch = habit.frequency.match(/(\d+)\s+times?\s+per\s+month/i);
          if (monthMatch && monthMatch[1]) {
            const timesPerMonth = parseInt(monthMatch[1], 10);
            const monthsInPeriod = Math.ceil(days / 30);
            targetCompletions = timesPerMonth * monthsInPeriod;
          }
          break;
      }
      
      // Get completions for this habit
      const completionsRef = collection(
        db, 
        'users', 
        userId, 
        'habits', 
        habit.id, 
        'completions'
      );
      
      const completionsQuery = query(
        completionsRef,
        where('date', '>=', startDate),
        orderBy('date', 'desc')
      );
      
      const completionsSnapshot = await getDocs(completionsQuery);
      const completions = completionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Calculate completion rate
      const completionRate = targetCompletions > 0 
        ? Math.min(100, Math.round((completions.length / targetCompletions) * 100))
        : 0;
      
      // Only include habits with some completions or targets
      if (completions.length > 0 || targetCompletions > 0) {
        habitDistribution.push({
          name: habit.name,
          value: completionRate,
          completions: completions.length,
          target: targetCompletions,
          color: habit.color || '#8b5cf6'
        });
      }
    }
    
    // Sort by completion rate (highest first)
    habitDistribution.sort((a, b) => b.value - a.value);
    
    // Take top habits (limit to 5-6 for visualization)
    return habitDistribution.slice(0, 6);
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetHabitDistributionData').originalError;
  }
};

/**
 * Get current streak data for each habit
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Streak data for each habit
 */
export const getCurrentStreaks = async (userId) => {
  if (!userId) {
    const error = new Error('User ID is required');
    throw handleFirebaseError(error, false, 'GetCurrentStreaks').originalError;
  }

  try {
    // Get all active habits - avoid using composite index by getting all active habits first
    const habitsRef = collection(db, 'users', userId, 'habits');
    const habitsQuery = query(
      habitsRef,
      where('status', '==', 'active')
    );
    
    const habitsSnapshot = await getDocs(habitsQuery);
    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort habits by streak manually in JavaScript instead of in the query
    habits.sort((a, b) => (b.streak || 0) - (a.streak || 0));
    
    // Get the habit streaks
    return habits.map(habit => ({
      habit: habit.name,
      current: habit.streak || 0,
      longest: habit.longestStreak || habit.streak || 0
    })).slice(0, 4); // Limit to top 4 for UI
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetCurrentStreaks').originalError;
  }
};

/**
 * Get achievement data
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Achievement data
 */
export const getAchievements = async (userId) => {
  if (!userId) {
    const error = new Error('User ID is required');
    throw handleFirebaseError(error, false, 'GetAchievements').originalError;
  }

  try {
    // Get user habit data
    const habitsRef = collection(db, 'users', userId, 'habits');
    const habitsSnapshot = await getDocs(habitsRef);
    const habits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Define achievements
    const achievements = [
      { 
        title: "7-Day Streak", 
        icon: "flame", 
        description: "Maintain a habit for 7 consecutive days",
        check: () => habits.some(h => (h.streak || 0) >= 7)
      },
      { 
        title: "21-Day Milestone", 
        icon: "badge",
        description: "Reach the habit-forming milestone",
        check: () => habits.some(h => (h.streak || 0) >= 21)
      },
      { 
        title: "Perfect Week", 
        icon: "star",
        description: "Complete all habits for a full week",
        check: () => {
          // This would require analyzing a full week of data
          // Simplified implementation for now
          const activeHabits = habits.filter(h => h.status === 'active');
          const totalCompletions = activeHabits.reduce((sum, h) => sum + (h.totalCompletions || 0), 0);
          return activeHabits.length > 0 && totalCompletions >= activeHabits.length * 7;
        }
      },
      { 
        title: "Habit Master", 
        icon: "academic-cap",
        description: "Maintain 5 habits for 30+ days",
        check: () => habits.filter(h => (h.streak || 0) >= 30).length >= 5
      },
      { 
        title: "Early Bird", 
        icon: "sun",
        description: "Complete morning habits consistently",
        check: () => habits.some(h => 
          h.timeOfDay === 'morning' && 
          (h.streak || 0) >= 7
        )
      },
      { 
        title: "Night Owl", 
        icon: "moon",
        description: "Complete evening habits consistently",
        check: () => habits.some(h => 
          h.timeOfDay === 'evening' && 
          (h.streak || 0) >= 7
        )
      }
    ];
    
    // Evaluate achievements
    return achievements.map(achievement => ({
      ...achievement,
      achieved: achievement.check()
    }));
  } catch (error) {
    throw handleFirebaseError(error, false, 'GetAchievements').originalError;
  }
};