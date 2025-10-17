import React, { useState } from 'react';
import { LoadingSpinner } from '../../../components/ui';

const HabitForm = ({ habit = null, onSubmit, onCancel, isLoading = false }) => {
  // Initialize state with existing habit data or default values
  const [formData, setFormData] = useState({
    id: habit?.id || undefined, // Only use ID for existing habits, let Firebase generate for new ones
    name: habit?.name || habit?.title || '', // Use name instead of title, but fallback to title for compatibility
    description: habit?.description || '',
    icon: habit?.icon || 'star',
    color: habit?.color || 'indigo',
    frequency: habit?.frequency || 'daily',
    time: habit?.time || 'anytime',
    days: habit?.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    reminderTime: habit?.reminderTime || '',
    reminderEnabled: habit?.reminderEnabled || false,
    createdAt: habit?.createdAt || new Date().toISOString(),
    streak: habit?.streak || 0,
    longestStreak: habit?.longestStreak || 0,
    startDate: habit?.startDate || new Date().toISOString().split('T')[0],
    completedDates: habit?.completedDates || {}
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // Handle input changes
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
      // If day exists, remove it, otherwise add it
      const updatedDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      
      return {
        ...prev,
        days: updatedDays
      };
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.title = "Habit name is required";
    }
    
    if (formData.frequency === 'weekly' && formData.days.length === 0) {
      newErrors.days = "Select at least one day of the week";
    }
    
    if (formData.reminderEnabled && !formData.reminderTime) {
      newErrors.reminderTime = "Reminder time is required when reminders are enabled";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Available icon options
  const iconOptions = [
    { value: 'star', label: 'Star' },
    { value: 'book', label: 'Book' },
    { value: 'water', label: 'Water' },
    { value: 'run', label: 'Run' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'food', label: 'Food' },
    { value: 'gym', label: 'Gym' },
    { value: 'code', label: 'Code' }
  ];

  // Available color options
  const colorOptions = [
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Habit Title */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Habit Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Daily Meditation"
          className={`block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-accent focus:ring-accent sm:text-sm ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Habit Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What does this habit involve?"
          rows="2"
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
        ></textarea>
      </div>

      {/* Icon and Color Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Icon
          </label>
          <select
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
          >
            {iconOptions.map((icon) => (
              <option key={icon.value} value={icon.value}>{icon.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                type="button"
                key={color.value}
                onClick={() => setFormData({...formData, color: color.value})}
                className={`h-6 w-6 rounded-full ${color.class} ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
                title={color.label}
                aria-label={`Select ${color.label} color`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Frequency Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Frequency
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`py-2 px-4 rounded-md border text-sm font-medium ${
              formData.frequency === 'daily'
                ? 'bg-accent text-white border-accent'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => setFormData({...formData, frequency: 'daily'})}
          >
            Daily
          </button>
          <button
            type="button"
            className={`py-2 px-4 rounded-md border text-sm font-medium ${
              formData.frequency === 'weekly'
                ? 'bg-accent text-white border-accent'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => setFormData({...formData, frequency: 'weekly'})}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Days of Week (if weekly) */}
      {formData.frequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Days of Week
          </label>
          <div className="flex flex-wrap gap-2">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`py-1 px-2 text-xs rounded-md border ${
                  formData.days.includes(day)
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
              </button>
            ))}
          </div>
          {errors.days && <p className="mt-1 text-xs text-red-500">{errors.days}</p>}
        </div>
      )}

      {/* Time of Day */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Time of Day
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['morning', 'afternoon', 'evening', 'anytime'].map((time) => (
            <button
              type="button"
              key={time}
              onClick={() => setFormData({...formData, time})}
              className={`py-2 px-3 rounded-md border text-sm font-medium ${
                formData.time === time
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reminder Settings */}
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="reminderEnabled"
            name="reminderEnabled"
            checked={formData.reminderEnabled}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <label htmlFor="reminderEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Enable reminder
          </label>
        </div>
        
        {formData.reminderEnabled && (
          <div className="mt-3">
            <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reminder time
            </label>
            <input
              type="time"
              id="reminderTime"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-accent focus:ring-accent sm:text-sm ${errors.reminderTime ? 'border-red-500' : ''}`}
            />
            {errors.reminderTime && <p className="mt-1 text-xs text-red-500">{errors.reminderTime}</p>}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-accent border border-transparent rounded-md shadow-sm hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            habit ? 'Update Habit' : 'Create Habit'
          )}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;