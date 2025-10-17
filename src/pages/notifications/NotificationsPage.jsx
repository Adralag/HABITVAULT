import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/dashboard/DashboardLayout';
import Card from '../../components/ui/dashboard/Card';
import Button from '../../components/ui/Button';
import { useReminders } from '../../hooks/useReminders';
import { useHabits } from '../../hooks/useHabits';
import { LoadingSpinner, ErrorMessage } from '../../components/ui';
import ReminderForm from '../../components/ui/notifications/ReminderForm';

const NotificationsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  
  // Get reminders from the hooks
  const {
    activeReminders,
    inactiveReminders,
    loading,
    error,
    toggleReminderStatus,
    deleteReminder,
    updateReminder,
    createReminder
  } = useReminders();
  
  // Get habits for the form dropdown
  const { habits, loading: loadingHabits } = useHabits();
  
  const handleToggleActive = async (id) => {
    try {
      await toggleReminderStatus(id);
    } catch (error) {
      console.error('Error toggling reminder status:', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };
  
  const handleEdit = (reminder) => {
    setSelectedReminder(reminder);
    setShowAddForm(true);
  };
  
  const handleSubmitReminder = async (reminderData) => {
    try {
      if (selectedReminder) {
        await updateReminder(selectedReminder.id, reminderData);
      } else {
        await createReminder(reminderData);
      }
      
      setShowAddForm(false);
      setSelectedReminder(null);
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  // Function to format time for display
  const formatTime = (time) => {
    if (!time) return '';
    
    // Handle HH:MM format
    const [hours, minutes] = time.split(':');
    if (hours && minutes) {
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    
    return time;
  };

  // Function to format days for display
  const formatDays = (days) => {
    if (!days || days.length === 0) return 'No days selected';
    if (days.length === 7) return 'Every day';
    
    const shortDays = {
      'Monday': 'Mon',
      'Tuesday': 'Tue',
      'Wednesday': 'Wed',
      'Thursday': 'Thu',
      'Friday': 'Fri',
      'Saturday': 'Sat',
      'Sunday': 'Sun'
    };
    
    return days.map(day => shortDays[day] || day).join(', ');
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">Notifications</h1>
          <p className="text-muted-light dark:text-muted-dark">Manage your habit reminders</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedReminder(null);
            setShowAddForm(!showAddForm);
          }}
          icon={
            showAddForm ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )
          }
        >
          {showAddForm ? 'Cancel' : 'Add Reminder'}
        </Button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error.message} />
        </div>
      )}
      
      {showAddForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-poppins">
            {selectedReminder ? 'Edit Reminder' : 'Create New Reminder'}
          </h2>
          
          <ReminderForm 
            onSubmit={handleSubmitReminder}
            onCancel={() => {
              setShowAddForm(false);
              setSelectedReminder(null);
            }}
            reminder={selectedReminder}
            habits={habits}
            isLoading={loading || loadingHabits}
          />
        </Card>
      )}

      {/* Notification groups */}
      {!loading && !error && (
        <Card 
          title="Active Reminders" 
          className="mb-6"
        >
          {activeReminders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-light dark:text-muted-dark">No active reminders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeReminders.map(reminder => (
                <div 
                  key={reminder.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start sm:items-center">
                    <div className="bg-accent/10 rounded-full p-2 mr-4 mt-1 sm:mt-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white font-poppins">{reminder.title}</h3>
                      <p className="text-sm text-muted-light dark:text-muted-dark">{reminder.message}</p>
                      <div className="flex flex-wrap items-center mt-1 text-xs text-muted-light dark:text-muted-dark">
                        <div className="flex items-center mr-3 mb-1 sm:mb-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTime(reminder.time)}</span>
                        </div>
                        
                        <div className="flex items-center mb-1 sm:mb-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDays(reminder.days)}</span>
                        </div>
                        
                        {reminder.repeatHours && (
                          <span className="ml-0 sm:ml-3 mt-1 sm:mt-0 block sm:inline">
                            Repeats every {reminder.repeatHours} hours
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0 justify-end">
                    <button 
                      onClick={() => handleEdit(reminder)}
                      className="p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Edit"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleToggleActive(reminder.id)}
                      className="p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Disable"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Delete"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      
      {!loading && !error && (
        <Card title="Inactive Reminders">
          {inactiveReminders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-light dark:text-muted-dark">No inactive reminders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inactiveReminders.map(reminder => (
                <div 
                  key={reminder.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600 dark:text-gray-400 font-poppins line-through">{reminder.title}</h3>
                      <p className="text-sm text-muted-light dark:text-muted-dark">{reminder.message}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-light dark:text-muted-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="mr-3">{formatTime(reminder.time)}</span>
                        
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDays(reminder.days)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(reminder)}
                      className="p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Edit"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleToggleActive(reminder.id)}
                      className="p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Enable"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Delete"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;