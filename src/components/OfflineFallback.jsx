import React from 'react';
import Logo from './ui/Logo';

/**
 * Offline Fallback Page
 * Displayed when the user is offline and tries to access a page that's not cached
 */
const OfflineFallback = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold text-white mb-4 font-poppins">
          You're Offline
        </h1>
        
        <p className="text-white mb-6 font-inter">
          It seems you're not connected to the internet. Some features of HabitVault require an active connection.
        </p>
        
        <div className="bg-primary p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-white mb-3 font-poppins">
            What you can do:
          </h2>
          
          <ul className="text-left text-white-600 space-y-3">
            <li className="flex items-start">
              <span className="text-secondary mr-2">•</span> 
              <span>Check your internet connection and try again</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">•</span> 
              <span>Access previously viewed pages that might be cached</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">•</span> 
              <span>Return to the home page once you're back online</span>
            </li>
          </ul>
        </div>
        
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-accent to-secondary text-white px-6 py-3 rounded-md font-medium transition-all shadow-md hover:shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default OfflineFallback;