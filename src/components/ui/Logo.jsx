import React from 'react';
import logoImage from '../../assets/logo-no-bg.png';

/**
 * HabitVault Logo component
 * Uses the provided logo image
 */
const Logo = ({ className = '', size = 'md', showText = false }) => {
  // Size variants
  const sizes = {
    sm: 'w-8',
    md: 'w-12',
    lg: 'w-20',
    xl: 'w-32',
  };

  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="HabitVault Logo" 
        className={`${sizeClass} object-contain`}
      />
      
      {showText && (
        <div className="mt-2 text-white font-poppins font-bold text-2xl">
          HabitVault
        </div>
      )}
    </div>
  );
};

export default Logo;