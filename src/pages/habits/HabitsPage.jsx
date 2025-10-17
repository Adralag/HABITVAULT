import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/layout/dashboard/DashboardLayout';
import Card from '../../components/ui/dashboard/Card';
import HabitCard from '../../components/ui/dashboard/HabitCard';
import HabitModal from '../../components/ui/dashboard/HabitModal';
import HabitViewModal from '../../components/ui/dashboard/HabitViewModal';
import { LoadingOverlay, ErrorMessage } from '../../components/ui/LoadingStates';
import { useHabits } from '../../hooks/useHabits';

const HabitsPage = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  
  // Use the habits hook to fetch data from Firebase
  const { 
    habits, 
    loading, 
    error, 
    clearError, 
    completeHabit,
    addHabit,
    updateHabit,
    deleteHabit
  } = useHabits();
  
  // Extract unique categories from habits
  const categories = useMemo(() => {
    const uniqueCategories = new Set(habits.map(habit => habit.category).filter(Boolean));
    return ['All', ...Array.from(uniqueCategories)];
  }, [habits]);
  
  // Handler for marking a habit as complete
  const handleComplete = async (id) => {
    try {
      await completeHabit(id);
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };
  
  // Handler for opening the view modal
  const handleView = (id) => {
    const habit = habits.find(h => h.id === id);
    setSelectedHabit(habit);
    setIsViewModalOpen(true);
  };
  
  // Handler for editing a habit
  const handleEdit = (id) => {
    const habit = habits.find(h => h.id === id);
    setSelectedHabit(habit);
    setIsEditModalOpen(true);
  };
  
  // Handler for creating a new habit
  const handleCreate = () => {
    setSelectedHabit(null);
    setIsCreateModalOpen(true);
  };
  
  // Handler for saving a new or edited habit
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
      
      // Close modals after saving
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };
  
  // Handler for deleting a habit
  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      setIsViewModalOpen(false);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  // Filter habits based on category and search query
  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      // Only show active habits (not archived)
      if (habit.status === 'archived') return false;
      
      const matchesCategory = filter === 'All' || habit.category === filter;
      const matchesSearch = habit.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [habits, filter, searchQuery]);

  return (
    <DashboardLayout>
      <LoadingOverlay isLoading={loading && habits.length === 0} text="Loading your habits...">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-light dark:text-text-dark font-poppins">My Habits</h1>
              <p className="text-muted-light dark:text-muted-dark mt-1">Manage and track your habits</p>
            </div>
            
            <button 
              onClick={handleCreate}
              className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-accent to-secondary text-white font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity"
            >
              Create New Habit
            </button>
          </div>
          
          {/* Error Message */}
          <ErrorMessage 
            error={error ? error.message : null} 
            onRetry={clearError} 
          />
          
          {/* Search and Filter */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Search Habits
                </label>
                <input
                  type="text"
                  id="search"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="md:w-48">
                <label htmlFor="category" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Filter by Category
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Habits Grid */}
          {!loading && filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHabits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onComplete={handleComplete}
                  onEdit={handleEdit}
                  onClick={() => handleView(habit.id)}
                />
              ))}
            </div>
          ) : !loading && (
            <Card className="p-8 text-center">
              <div className="text-muted-light dark:text-muted-dark">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 9.5 14.5 14.5M14.5 9.5 9.5 14.5M7.8 4.8A10 10 0 0 0 2 12a10 10 0 0 0 20 0 10 10 0 0 0-7.8-7.2" />
                </svg>
                <h3 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">No habits found</h3>
                <p className="mb-6">Try changing your search or filter, or create a new habit.</p>
                <button 
                  onClick={handleCreate}
                  className="px-4 py-2 bg-gradient-to-r from-accent to-secondary text-white font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity inline-block"
                >
                  Create New Habit
                </button>
              </div>
            </Card>
          )}
        </div>
      </LoadingOverlay>
      
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
          onComplete={() => {
            handleComplete(selectedHabit.id);
            setIsViewModalOpen(false);
          }}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={() => handleDelete(selectedHabit.id)}
          isLoading={loading}
        />
      )}
    </DashboardLayout>
  );
};

export default HabitsPage;