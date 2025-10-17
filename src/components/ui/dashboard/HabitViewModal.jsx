import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import HabitModal from './HabitModal';
import { LoadingSpinner } from '../../../components/ui';

// Calendar cell component for habit history
const CalendarCell = ({ day, completed, isToday }) => {
  const baseClasses = "w-8 h-8 flex items-center justify-center rounded-md text-sm";
  
  let cellClasses = `${baseClasses} `;
  
  if (isToday) {
    cellClasses += completed 
      ? "bg-accent text-white ring-2 ring-offset-1 ring-accent" 
      : "bg-gray-100 dark:bg-gray-700 ring-2 ring-offset-1 ring-gray-400 dark:ring-gray-500";
  } else {
    cellClasses += completed 
      ? "bg-accent/80 text-white" 
      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
  }
  
  return (
    <div className={cellClasses}>
      {day}
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const HabitViewModal = ({ 
  isOpen, 
  closeModal, 
  habit,
  onComplete,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use actual completion history or generate placeholder if not available
  const completionHistory = habit?.completionHistory || generatePlaceholderHistory();

  function generatePlaceholderHistory() {
    // If we're loading, return an empty array to avoid showing fake data
    if (isLoading) return [];
    
    const history = [];
    const now = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Placeholder data - will be replaced with real data
      const completed = false;
      
      history.push({ date: dateString, completed });
    }
    
    return history;
  }

  // Generate calendar days for last 2 weeks
  const generateCalendarDays = () => {
    const days = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Go back 13 days (2 weeks)
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayNum = date.getDate();
      const historyItem = completionHistory.find(item => item.date === dateString);
      const completed = historyItem ? historyItem.completed : false;
      const isToday = dateString === today;
      
      days.push({ day: dayNum, completed, isToday, date: dateString });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Calculate stats
  const totalCompletions = completionHistory.filter(day => day.completed).length;
  const successRate = Math.round((totalCompletions / completionHistory.length) * 100);

  if (!habit) return null;

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
                          style={{ 
                            backgroundColor: `${habit.color}20`, 
                            color: habit.color 
                          }}
                        >
                          {habit.category}
                        </span>
                        {habit.frequency && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {habit.frequency}
                          </span>
                        )}
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-semibold text-gray-900 dark:text-white"
                      >
                        {habit.name}
                      </Dialog.Title>
                      {habit.description && (
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {habit.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
                      {isLoading ? (
                        <div className="h-7 flex items-center justify-center">
                          <div className="w-10 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                        </div>
                      ) : (
                        <h4 className="text-lg font-bold">{habit.streak || 0} days</h4>
                      )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Frequency</p>
                      {isLoading ? (
                        <div className="h-7 flex items-center justify-center">
                          <div className="w-16 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                        </div>
                      ) : (
                        <h4 className="text-lg font-bold">{habit.frequency || 'Daily'}</h4>
                      )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completions</p>
                      {isLoading ? (
                        <div className="h-7 flex items-center justify-center">
                          <div className="w-8 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                        </div>
                      ) : (
                        <h4 className="text-lg font-bold">{totalCompletions}</h4>
                      )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate</p>
                      {isLoading ? (
                        <div className="h-7 flex items-center justify-center">
                          <div className="w-12 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                        </div>
                      ) : (
                        <h4 className="text-lg font-bold">{successRate}%</h4>
                      )}
                    </div>
                  </div>

                  {/* Calendar History */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Recent History (Last 14 Days)
                    </h4>
                    <div className="grid grid-cols-7 gap-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {isLoading ? (
                      <div className="mt-4 flex items-center justify-center h-20">
                        <LoadingSpinner size="md" />
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          Loading habit history...
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-1 mt-1">
                        {calendarDays.map((day, index) => (
                          <div key={index} className="flex justify-center">
                            <CalendarCell 
                              day={day.day} 
                              completed={day.completed} 
                              isToday={day.isToday} 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    {/* Action button (Complete/Completed) */}
                    <div>
                      {habit.completedToday ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Completed Today
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onComplete(habit.id);
                            closeModal();
                          }}
                          disabled={isLoading}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
                        >
                          {isLoading ? (
                            <>
                              <LoadingSpinner size="sm" color="white" />
                              <span className="ml-1.5">Processing...</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Mark as Complete
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Edit/Delete buttons */}
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(true)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      
                      {showDeleteConfirm ? (
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(habit.id);
                            closeModal();
                          }}
                          disabled={isLoading}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
                        >
                          {isLoading ? (
                            <>
                              <LoadingSpinner size="sm" color="white" />
                              <span className="ml-1.5">Deleting...</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Confirm
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={isLoading}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit modal */}
      {showEditModal && (
        <HabitModal 
          isOpen={showEditModal}
          closeModal={() => setShowEditModal(false)}
          habit={habit}
          isLoading={isLoading}
          onSubmit={(updatedHabit) => {
            onEdit(updatedHabit);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default HabitViewModal;