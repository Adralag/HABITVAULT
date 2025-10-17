import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  padding = true,
  action = null,
  loading = false,
  onClick = null
}) => {
  return (
    <div 
      className={`bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${className} ${onClick ? 'hover:shadow-md transition-shadow duration-200' : ''}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Card header if there's a title */}
      {(title || action) && (
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-white font-poppins">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-light dark:text-muted-dark">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      {/* Card body */}
      <div className={`${padding ? 'p-6' : 'p-0'}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Card;