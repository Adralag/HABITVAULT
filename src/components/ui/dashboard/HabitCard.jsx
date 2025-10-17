import React from 'react';
import Card from './Card';
import { LoadingSpinner } from '../../../components/ui';

const HabitCard = ({ 
  habit, 
  onComplete, 
  onEdit, 
  onClick,
  showActions = true,
  className = '',
  isLoading = false,
}) => {
  const { id, name, description, streak, completedToday, category, progress } = habit;
  
  // Calculate progress percentage
  const progressPercentage = progress ? progress : (completedToday ? 100 : 0);

  return (
    <Card 
      className={`h-full transition-transform hover:translate-y-[-2px] ${className} cursor-pointer`} 
      padding={false}
      onClick={onClick}
    >
      <div className="p-5">
        {/* Category badge */}
        {category && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 mb-3">
            {category}
          </span>
        )}
        
        {/* Habit name and description */}
        <div onClick={onClick} className="block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-poppins mb-1">{name}</h3>
          {description && (
            <p className="text-sm text-muted-light dark:text-muted-dark line-clamp-2 mb-3">{description}</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 mt-4">
          <div 
            className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Streak and actions */}
        <div className="flex items-center justify-between mt-3">
          {/* Streak counter */}
          <div className="flex items-center">
            <span className="flex items-center text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
              </svg>
              <span className="ml-1 text-sm font-medium">
                {streak} {streak === 1 ? 'day' : 'days'}
              </span>
            </span>
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className="flex items-center space-x-2">
              {/* Complete button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(id);
                }}
                disabled={completedToday || isLoading}
                className={`p-1 rounded-full ${
                  completedToday
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 cursor-default'
                    : isLoading
                    ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-wait'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={completedToday ? 'Completed' : isLoading ? 'Loading...' : 'Mark as complete'}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="secondary" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Edit button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                disabled={isLoading}
                className={`p-1 rounded-full ${
                  isLoading 
                    ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-wait'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={isLoading ? 'Loading...' : 'Edit habit'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;