import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-150';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-accent to-secondary text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-accent',
    secondary: 'bg-white dark:bg-gray-800 text-primary dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-accent',
    outline: 'bg-transparent border border-accent text-accent hover:bg-accent/10 focus:ring-2 focus:ring-offset-2 focus:ring-accent',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-base',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? disabledStyles : ''}
        ${widthStyles}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;