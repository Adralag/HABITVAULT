import React, { useState, useEffect } from 'react';
import Button from '../Button';
import LoadingSpinner from '../LoadingStates';

const ReminderForm = ({ onSubmit, onCancel, reminder, habits, isLoading }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    habitId: '',
    message: '',
    time: '',
    active: true,
    days: [],
    repeatHours: 0,
    endTime: ''
  });

  // Initialize form with reminder data when editing
  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title || '',
        habitId: reminder.habitId || '',
        message: reminder.message || '',
        time: reminder.time || '',
        active: reminder.active !== undefined ? reminder.active : true,
        days: reminder.days || [],
        repeatHours: reminder.repeatHours || 0,
        endTime: reminder.endTime || ''
      });
    }
  }, [reminder]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle day selection
  const handleDayToggle = (day) => {
    setFormData(prev => {
      const currentDays = [...prev.days];
      if (currentDays.includes(day)) {
        return {
          ...prev,
          days: currentDays.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          days: [...currentDays, day]
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // All days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="Reminder Title"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="habitId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Related Habit
          </label>
          <select
            id="habitId"
            name="habitId"
            value={formData.habitId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
            disabled={isLoading}
          >
            <option value="">Select a habit (optional)</option>
            {habits && habits.map(habit => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="Reminder message"
            rows="3"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center mt-6 sm:mt-0 sm:pt-7">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Days</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <label 
              key={day} 
              className={`inline-flex items-center justify-center px-2 py-1.5 border rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors
                ${formData.days.includes(day) 
                  ? 'bg-accent border-accent text-white' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={() => handleDayToggle(day)}
            >
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={formData.days.includes(day)}
                readOnly
                disabled={isLoading}
              />
              {day.substring(0, 3)}
            </label>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button 
          type="button"
          variant="secondary" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              {reminder ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            reminder ? 'Update Reminder' : 'Create Reminder'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReminderForm;