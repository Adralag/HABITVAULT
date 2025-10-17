import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/dashboard/DashboardLayout';
import Card from '../../components/ui/dashboard/Card';
import { useGoals } from '../../hooks/useGoals';
import { LoadingSpinner, CardSkeleton, ErrorMessage } from '../../components/ui';

// Icons
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const FireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

// Modal Component for creating/editing goals
const GoalModal = ({ isOpen, onClose, onSave, initialData = {}, habits = [] }) => {
  const [formData, setFormData] = useState(initialData);
  
  // Make habits available to the select element
  window.habits = habits;

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {initialData.id ? 'Edit Goal' : 'Create New Goal'}
            </h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habit
                </label>
                <select
                  name="habitId"
                  value={formData.habitId || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a habit</option>
                  {window.habits && window.habits.map(habit => (
                    <option key={habit.id} value={habit.id}>{habit.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target
                  </label>
                  <input
                    type="number"
                    name="target"
                    value={formData.target || ''}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit || ''}
                    onChange={handleChange}
                    placeholder="minutes, books, etc."
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-accent rounded-md shadow-sm hover:bg-accent/90"
                >
                  {initialData.id ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Goal Card Component
const GoalCard = ({ goal, onEdit, onUpdateProgress }) => {
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(goal.progress || 0);
  
  const handleProgressChange = (e) => {
    setProgressValue(Number(e.target.value));
  };
  
  const handleProgressUpdate = async () => {
    setIsUpdatingProgress(true);
    try {
      await onUpdateProgress(goal.id, progressValue);
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setIsUpdatingProgress(false);
    }
  };
  
  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{goal.habitName}</h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
            {goal.frequency}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Target: {goal.target} {goal.unit}
        </p>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-accent h-2.5 rounded-full" 
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progressValue}
              onChange={handleProgressChange}
              className="w-2/3 accent-accent"
            />
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                {progressValue}%
              </span>
              <button
                onClick={handleProgressUpdate}
                disabled={isUpdatingProgress || progressValue === goal.progress}
                className="p-1 text-xs bg-accent text-white rounded hover:bg-accent/90 disabled:opacity-50"
              >
                {isUpdatingProgress ? (
                  <LoadingSpinner size="xs" color="white" />
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <FireIcon />
            <div className="ml-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{goal.currentStreak || 0} days</p>
            </div>
          </div>
          
          <div className="flex items-center ml-auto">
            <TrophyIcon />
            <div className="ml-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{goal.longestStreak || 0} days</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <p>Period: {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}</p>
        </div>
        
        <button
          onClick={onEdit}
          className="mt-4 self-end px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Edit
        </button>
      </div>
    </Card>
  );
};

// Achievement Component
const Achievement = ({ icon, title, value, color }) => {
  const colorClasses = {
    gold: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    silver: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    bronze: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
  };
  
  return (
    <div className={`flex items-center p-4 rounded-lg ${colorClasses[color]}`}>
      <div className="mr-4 text-2xl">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

const GoalsAndStreaksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState({});
  const {
    goals,
    loading,
    error,
    clearError,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    achievements,
    habits
  } = useGoals();
  
  const handleSaveGoal = async (goalData) => {
    try {
      if (goalData.id) {
        await updateGoal(goalData.id, goalData);
      } else {
        await addGoal(goalData);
      }
    } catch (err) {
      console.error('Error saving goal:', err);
    }
  };
  
  // Render error state if there's an error
  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage
          variant={error.variant}
          title="Failed to load goals"
          message={error.message}
          onRetry={() => clearError()}
          error={error.originalError}
        />
      </DashboardLayout>
    );
  }

  const activeGoals = goals.filter(goal => goal.status === 'active');
  
  // Get today's date for streak calendar
  const today = new Date();
  const formatDateTitle = (date) => {
    return date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">Goals & Streaks</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your progress and maintain consistency
            </p>
          </div>
          
          <button
            onClick={() => {
              setCurrentGoal({});
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            disabled={loading}
          >
            <AddIcon />
            <span className="ml-2">New Goal</span>
          </button>
        </div>
        
        {/* Achievements Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Your Achievements
          </h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CardSkeleton height="100px" />
              <CardSkeleton height="100px" />
              <CardSkeleton height="100px" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Achievement 
                icon="🔥" 
                title="Longest Streak" 
                value={`${achievements.longestStreak} days`} 
                color="gold"
              />
              <Achievement 
                icon="✅" 
                title="Total Completed" 
                value={`${achievements.totalCompletions} habits`} 
                color="silver"
              />
              <Achievement 
                icon="🎯" 
                title="Goals Achieved" 
                value={`${achievements.goalsAchieved} goals`} 
                color="bronze"
              />
            </div>
          )}
        </section>
        
        {/* Current Goals Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Your Current Goals
          </h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton height="250px" />
              <CardSkeleton height="250px" />
              <CardSkeleton height="250px" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onEdit={() => {
                    setCurrentGoal(goal);
                    setIsModalOpen(true);
                  }}
                  onUpdateProgress={updateProgress}
                />
              ))}
              
              {/* Add New Goal Card */}
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-accent dark:hover:border-accent/70 transition-colors"
                onClick={() => {
                  setCurrentGoal({});
                  setIsModalOpen(true);
                }}
              >
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent">
                    <AddIcon />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Create a new goal</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Set targets and track your progress
                  </p>
                </div>
              </Card>
            </div>
          )}
          
          {/* Empty state */}
          {!loading && activeGoals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No goals yet</h3>
              <p className="text-muted-light dark:text-muted-dark mb-4">Create your first goal to start tracking your progress</p>
              <button
                onClick={() => {
                  setCurrentGoal({});
                  setIsModalOpen(true);
                }}
                className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
              >
                <AddIcon />
                <span className="ml-2">Create Your First Goal</span>
              </button>
            </div>
          )}
        </section>
        
        {/* Streak Calendar Section */}
        <section>
          <Card title="Streak Calendar" subtitle="Your activity over the last 30 days">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  // Calculate date for this day
                  const date = new Date(today);
                  date.setDate(today.getDate() - (29 - i));
                  
                  // Generate deterministic activity level based on day of month
                  // In a real app, this would come from habit completion data
                  const activityLevel = Math.floor((date.getDate() * 13) % 4);
                  
                  const bgColors = [
                    'bg-gray-200 dark:bg-gray-700', // No activity
                    'bg-accent/30',                 // Low activity
                    'bg-accent/60',                 // Medium activity
                    'bg-accent'                     // High activity
                  ];
                  
                  return (
                    <div 
                      key={i}
                      className={`h-8 w-8 rounded-sm ${bgColors[activityLevel]} flex items-center justify-center`}
                      title={formatDateTitle(date)}
                    >
                      <span className="text-xs text-white dark:text-gray-100 font-medium">
                        {date.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </section>
      </div>
      
      {/* Goal Modal */}
      <GoalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGoal}
        initialData={currentGoal}
        habits={habits}
        isLoading={loading}
      />
    </DashboardLayout>
  );
};

export default GoalsAndStreaksPage;