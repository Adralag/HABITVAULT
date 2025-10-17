import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/dashboard/DashboardLayout';
import Card from '../../components/ui/dashboard/Card';
import Button from '../../components/ui/Button';
import { useHabit } from '../../hooks/useHabit';
import LoadingSpinner, { LoadingOverlay, ErrorMessage } from '../../components/ui/LoadingStates';

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  // Check if it's a Firebase timestamp or a Date
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calendar cell component for habit history
const CalendarCell = ({ day, completed, isToday }) => {
  const baseClasses = "w-10 h-10 flex items-center justify-center rounded-md text-sm";
  
  let cellClasses = `${baseClasses} `;
  
  if (isToday) {
    cellClasses += completed 
      ? "bg-accent text-white ring-2 ring-offset-2 ring-accent" 
      : "bg-gray-100 dark:bg-gray-700 ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500";
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

const HabitDetailPage = () => {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const [showNotes, setShowNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  
  const {
    habit,
    loading,
    error,
    completeHabit,
    deleteHabit,
    saveNotes,
    isCompletedToday,
    getFormattedHistory
  } = useHabit(habitId);
  
  // Initialize notes when habit is loaded
  useEffect(() => {
    if (habit && habit.notes) {
      setNotesValue(habit.notes);
    }
  }, [habit]);

  // Handle marking habit as complete
  const handleCompleteHabit = async () => {
    try {
      await completeHabit();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  // Handle deleting the habit
  const handleDeleteHabit = async () => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      try {
        await deleteHabit();
        // Navigate back to habits list after deletion
        navigate('/dashboard/habits');
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };
  
  // Handle saving notes
  const handleSaveNotes = async () => {
    try {
      await saveNotes(notesValue);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };
  
  // Get calendar days from completion history
  const calendarDays = habit ? getFormattedHistory() : [];
  
  return (
    <DashboardLayout>
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/dashboard/habits" 
          className="text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-white flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Habits
        </Link>
        
        {!loading && habit && (
          <div className="flex space-x-3">
            <Link to={`/dashboard/habits/edit/${habitId}`}>
              <Button 
                variant="outline"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                }
              >
                Edit
              </Button>
            </Link>
            <Button 
              variant="danger"
              onClick={handleDeleteHabit}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <ErrorMessage 
          error={error.message} 
          onRetry={() => window.location.reload()}
        />
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading habit details...</p>
        </div>
      )}
      
      {/* No habit found */}
      {!loading && !habit && !error && (
        <Card className="mb-6">
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Habit not found</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">The habit you're looking for doesn't exist or has been deleted.</p>
            <div className="mt-6">
              <Link to="/dashboard/habits">
                <Button>Go Back to Habits</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
      
      {/* Habit header */}
      {!loading && habit && (
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 mr-2">
                  {habit.category}
                </span>
                <span className="text-muted-light dark:text-muted-dark text-sm">
                  Started {formatDate(formatTimestamp(habit.createdAt))}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-1">{habit.name}</h1>
              <p className="text-muted-light dark:text-muted-dark">{habit.description}</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              {isCompletedToday() ? (
                <div className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Completed Today</span>
                </div>
              ) : (
                <Button 
                  onClick={handleCompleteHabit}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
      
      {/* Stats and streak */}
      {!loading && habit && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="transition-all hover:shadow-md">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Current Streak</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins">{habit.streak || 0} days</h3>
            </div>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Frequency</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins">{habit.frequency || 'Daily'}</h3>
            </div>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Total Completions</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins">
                {habit.totalCompletions || 0}
              </h3>
            </div>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Status</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins capitalize">
                {habit.status || 'active'}
              </h3>
            </div>
          </Card>
        </div>
      )}
      
      {/* Habit history */}
      {!loading && habit && (
        <Card 
          title="Completion History" 
          subtitle="Last 28 days"
          className="mb-6"
        >
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-muted-light dark:text-muted-dark font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 mt-2">
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
        </Card>
      )}
      
      {/* Notes section */}
      {!loading && habit && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-poppins">Notes</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showNotes ? (
            <>
              <p className="text-muted-light dark:text-muted-dark mb-4">{habit.notes || "No notes yet."}</p>
              <textarea 
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Add notes about this habit..."
                rows={4}
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
              />
              <div className="flex justify-end mt-3">
                <Button size="sm" onClick={handleSaveNotes}>Save Notes</Button>
              </div>
            </>
          ) : (
            <p className="text-muted-light dark:text-muted-dark">
              {habit.notes 
                ? habit.notes.length > 50 ? `${habit.notes.substring(0, 50)}...` : habit.notes
                : "No notes yet."}
            </p>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
};

export default HabitDetailPage;