import React, { useState, useEffect } from 'react';

/**
 * PWA Install Prompt Component
 * Shows a button to install the PWA when it's available for installation
 */
const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    };
    
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };
    
    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    
    // Check if already installed
    checkIfInstalled();
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => setIsInstalled(true));
    };
  }, []);
  
  // Handle install button click
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    // Reset the install prompt variable
    setInstallPrompt(null);
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };
  
  // Don't show the button if:
  // 1. The install prompt isn't available (not installable or already in standalone mode)
  // 2. The app is already installed
  if (!installPrompt || isInstalled) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-50 md:left-auto md:bottom-8 md:right-8">
      <button
        onClick={handleInstallClick}
        className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-lg transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        Install App
      </button>
    </div>
  );
};

export default PWAInstallPrompt;