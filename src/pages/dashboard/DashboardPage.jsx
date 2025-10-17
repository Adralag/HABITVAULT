import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/dashboard/DashboardLayout';
import Card from '../../components/ui/dashboard/Card';
import Button from '../../components/ui/Button';
import HabitCard from '../../components/ui/dashboard/HabitCard';
import HabitModal from '../../components/ui/dashboard/HabitModal';
import HabitViewModal from '../../components/ui/dashboard/HabitViewModal';
import { useHabits } from '../../hooks/useHabits';
import { LoadingSpinner, CardSkeleton, ErrorMessage } from '../../components/ui';
import { calculateCompletionRate } from '../../utils/habitUtils';

// Today's date formatted nicely
const getTodayDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString(undefined, options);
};

const DashboardPage = () => {
  const {
    habits,
    loading,
    error,
    clearError,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getActiveHabits
  } = useHabits();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [stats, setStats] = useState({
    streaks: 0,
    completed: 0,
    total: 0,
    completionRate: 0
  });
  
  // Calculate dashboard stats whenever habits change
  useEffect(() => {
    if (!loading && habits.length > 0) {
      const activeHabits = habits.filter(h => h.status !== 'archived');
      const completedHabits = activeHabits.filter(h => h.completedToday);
      const totalStreaks = activeHabits.reduce((sum, h) => sum + (h.streak || 0), 0);
      
      setStats({
        streaks: totalStreaks,
        completed: completedHabits.length,
        total: activeHabits.length,
        completionRate: calculateCompletionRate(activeHabits)
      });
    }
  }, [habits, loading]);
  
  const handleCompleteHabit = async (id) => {
    try {
      await completeHabit(id);
    } catch (err) {
      console.error('Error completing habit:', err);
    }
  };
  
  const handleViewHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    setSelectedHabit(habit);
    setIsViewModalOpen(true);
  };
  
  const handleEditHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    setSelectedHabit(habit);
    setIsEditModalOpen(true);
  };
  
  const handleCreateHabit = () => {
    setSelectedHabit(null);
    setIsCreateModalOpen(true);
  };
  
  const handleSaveHabit = async (habitData) => {
    try {
      // Clone the data to avoid modifying the original
      const habitDataToSave = { ...habitData };
      
      if (habitData.id) {
        // Update existing habit
        const habitId = habitData.id;
        // Remove the ID from the data since it's passed as a separate parameter
        delete habitDataToSave.id;
        await updateHabit(habitId, habitDataToSave);
      } else {
        // Add new habit
        // Remove undefined id to let Firebase generate one
        delete habitDataToSave.id;
        await addHabit(habitDataToSave);
      }
      
      // Close modals
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error saving habit:', err);
    }
  };
  
  const handleDeleteHabit = async (id) => {
    try {
      await deleteHabit(id);
      setIsViewModalOpen(false);
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  // Define stat cards data based on the calculated stats
  const statCards = [
    {
      label: 'Current Streaks',
      value: stats.streaks.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-amber-500'
    },
    {
      label: 'Habits Completed',
      value: `${stats.completed}/${stats.total}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-500'
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-blue-500'
    }
  ];

  // Render error state if there's an error
  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage
          variant={error.variant}
          title="Failed to load habits"
          message={error.message}
          onRetry={() => window.location.reload()}
          error={error.originalError}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">Welcome back!</h1>
        <p className="text-muted-light dark:text-muted-dark">{getTodayDate()}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          statCards.map((stat, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-light dark:text-muted-dark">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-opacity-10 ${stat.color.replace('text', 'bg')}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Today's habits */}
      <Card 
        title="Today's Habits" 
        action={
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleCreateHabit}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
            disabled={loading}
          >
            Add New
          </Button>
        }
        className="mb-8"
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No habits yet</h3>
            <p className="text-muted-light dark:text-muted-dark mb-4">Create your first habit to start tracking your progress</p>
            <Button 
              variant="primary" 
              onClick={handleCreateHabit}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
            >
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.filter(habit => habit.status === 'active').map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={handleCompleteHabit}
                onEdit={handleEditHabit}
                onClick={() => handleViewHabit(habit.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Recent activity and progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <Card 
          title="Recent Activity" 
          className="lg:col-span-2"
        >
          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : habits.length === 0 ? (
            <div className="py-8 text-center text-muted-light dark:text-muted-dark">
              No recent activity to show
            </div>
          ) : (
            <div className="space-y-4">
              {habits.filter(habit => habit.status === 'active').slice(0, 3).map(habit => (
                <div 
                  key={habit.id} 
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleViewHabit(habit.id)}
                >
                  <div className={`p-2 rounded-full ${habit.completedToday ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {habit.completedToday ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{habit.name}</p>
                    <p className="text-sm text-muted-light dark:text-muted-dark">
                      {habit.completedToday 
                        ? 'Completed today' 
                        : 'Pending completion'}
                    </p>
                  </div>
                  {habit.completedToday && (
                    <div className="text-xs text-muted-light dark:text-muted-dark">
                      Today
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Weekly overview */}
        <Card title="Weekly Overview">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-accent to-secondary text-white mb-4">
                <span className="text-xl font-bold">{stats.completionRate}%</span>
              </div>
              <p className="text-sm text-center text-muted-light dark:text-muted-dark">Completion rate for this week</p>
              <div className="w-full mt-6 grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-full h-16 rounded-md ${i < 5 ? 'bg-accent/80' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    <span className="text-xs mt-1 text-muted-light dark:text-muted-dark">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Create Habit Modal */}
      <HabitModal
        isOpen={isCreateModalOpen}
        closeModal={() => setIsCreateModalOpen(false)}
        onSubmit={handleSaveHabit}
        title="Create New Habit"
        isLoading={loading}
      />
      
      {/* Edit Habit Modal */}
      <HabitModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        habit={selectedHabit}
        onSubmit={handleSaveHabit}
        title="Edit Habit"
        isLoading={loading}
      />
      
      {/* View Habit Modal */}
      {selectedHabit && (
        <HabitViewModal
          isOpen={isViewModalOpen}
          closeModal={() => setIsViewModalOpen(false)}
          habit={selectedHabit}
          onComplete={async () => {
            await handleCompleteHabit(selectedHabit.id);
            setIsViewModalOpen(false);
          }}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={async () => {
            await handleDeleteHabit(selectedHabit.id);
          }}
          isLoading={loading}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;