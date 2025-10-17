import React from 'react';
import DataFetchExample from '../components/common/DataFetchExample';
import { ErrorBoundary } from '../components/errors';

const HabitCard = ({ habit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{habit.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{habit.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Streak: {habit.streak} days
        </span>
        <span className={`px-2 py-1 text-xs rounded ${
          habit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {habit.status}
        </span>
      </div>
    </div>
  );
};

const DataFetchingExample = () => {
  // Mock data fetching function
  const fetchHabits = async () => {
    // Simulate API call with 1.5s delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Morning Meditation', description: '10 minutes of mindfulness', streak: 7, status: 'active' },
          { id: 2, name: 'Read Daily', description: '30 pages per day', streak: 12, status: 'active' },
          { id: 3, name: 'Exercise', description: '30 minutes of cardio', streak: 0, status: 'inactive' }
        ]);
      }, 1500);
    });
  };

  // Simulate an error
  const fetchWithError = async () => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Failed to fetch habits'));
      }, 1500);
    });
  };

  // Simulate empty data
  const fetchEmptyData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 1500);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Data Fetching Examples
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Loading with Spinner
          </h2>
          
          <ErrorBoundary>
            <DataFetchExample 
              fetchDataFn={fetchHabits}
              renderItem={(habit) => <HabitCard key={habit.id} habit={habit} />}
              loadingType="spinner"
              emptyTitle="No habits found"
              emptyMessage="You haven't created any habits yet."
              emptyActionText="Create Habit"
              emptyAction={() => alert('Create habit')}
            />
          </ErrorBoundary>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Loading with Skeleton
          </h2>
          
          <ErrorBoundary>
            <DataFetchExample 
              fetchDataFn={fetchHabits}
              renderItem={(habit) => <HabitCard key={habit.id} habit={habit} />}
              loadingType="skeleton"
              skeletonLines={3}
            />
          </ErrorBoundary>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Error State
          </h2>
          
          <ErrorBoundary>
            <DataFetchExample 
              fetchDataFn={fetchWithError}
              renderItem={(habit) => <HabitCard key={habit.id} habit={habit} />}
            />
          </ErrorBoundary>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Empty State
          </h2>
          
          <ErrorBoundary>
            <DataFetchExample 
              fetchDataFn={fetchEmptyData}
              renderItem={(habit) => <HabitCard key={habit.id} habit={habit} />}
              emptyTitle="No habits yet"
              emptyMessage="Time to start building some good habits!"
              emptyActionText="Create Your First Habit"
              emptyAction={() => alert('Create first habit')}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default DataFetchingExample;