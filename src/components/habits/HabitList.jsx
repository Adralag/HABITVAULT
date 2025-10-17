import React, { useState, useEffect } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { WithFirebaseOperationState } from '../../components/firebase';
import { ContentSkeleton, CardSkeleton } from '../../components/loading';
import HabitCard from '../ui/dashboard/HabitCard';
import Button from '../ui/Button';

/**
 * Component that showcases Firebase error handling and loading states
 */
const HabitList = ({ 
  category,
  showTitle = true,
  maxItems = null,
  emptyMessage = "No habits found",
  loadingType = "card", // 'card', 'skeleton', or 'spinner'
  skeletonCount = 3,
  onCreateHabit
}) => {
  const { 
    habits, 
    loading, 
    error, 
    clearError,
    getActiveHabits, 
    completeHabit 
  } = useHabits();
  
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [isCompletingHabit, setIsCompletingHabit] = useState(false);
  const [completingHabitId, setCompletingHabitId] = useState(null);

  // Filter and sort habits
  useEffect(() => {
    let result = category 
      ? habits.filter(h => h.category === category && h.status === 'active')
      : getActiveHabits();
    
    // Sort by most recent first
    result = result.sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completedToday && !b.completedToday) return 1;
      if (!a.completedToday && b.completedToday) return -1;
      
      // Then by creation date (newest first)
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
    
    // Limit if maxItems is provided
    if (maxItems && result.length > maxItems) {
      result = result.slice(0, maxItems);
    }
    
    setFilteredHabits(result);
  }, [habits, category, getActiveHabits, maxItems]);
  
  // Handle habit completion
  const handleCompleteHabit = async (habitId) => {
    setIsCompletingHabit(true);
    setCompletingHabitId(habitId);
    
    try {
      await completeHabit(habitId);
    } catch (err) {
      console.error('Failed to complete habit:', err);
    } finally {
      setIsCompletingHabit(false);
      setCompletingHabitId(null);
    }
  };
  
  // Generate loading skeleton based on type
  const renderLoading = () => {
    if (loadingType === 'card') {
      return <CardSkeleton count={skeletonCount} />;
    }
    
    if (loadingType === 'skeleton') {
      return <ContentSkeleton lines={5} />;
    }
    
    // Default spinner is handled by WithFirebaseOperationState
    return null;
  };
  
  // Render empty state
  const renderEmpty = () => {
    if (filteredHabits.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{emptyMessage}</p>
          {onCreateHabit && (
            <Button variant="outline" onClick={onCreateHabit}>
              Create a habit
            </Button>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Main content
  const renderContent = () => {
    if (filteredHabits.length === 0) {
      return renderEmpty();
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            isLoading={isCompletingHabit && completingHabitId === habit.id}
            onComplete={() => handleCompleteHabit(habit.id)}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="mb-8">
      {showTitle && category && (
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {category} Habits
        </h3>
      )}
      
      <WithFirebaseOperationState
        isLoading={loading}
        error={error}
        onRetry={clearError}
        context="Habits"
        loadingFallback={renderLoading()}
        loaderSize="lg"
        loaderColor="primary"
      >
        {renderContent()}
      </WithFirebaseOperationState>
    </div>
  );
};

export default HabitList;