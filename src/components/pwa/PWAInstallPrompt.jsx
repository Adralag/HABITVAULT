import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * PWA Install Prompt Component
 * Shows a button to install the PWA when it's available for installation
 * Provides instructions for iOS users who cannot install via prompt
 */
const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  
  // Listen for the beforeinstallprompt event
  useEffect(() => {
    // Check if it's an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOSDevice(isIOS);
    
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
    // For iOS devices, show the instructions
    if (isIOSDevice) {
      setShowIOSInstructions(!showIOSInstructions);
      return;
    }
    
    // For other devices, use the install prompt
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
  
  // Return null if the app is already installed
  if (isInstalled) return null;
  
  // Show iOS instructions or standard install button
  const shouldShowInstallOption = installPrompt || isIOSDevice;
  
  if (!shouldShowInstallOption) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 md:left-auto md:bottom-8 md:right-8">
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
          {isIOSDevice ? "Install on iOS" : "Install App"}
        </button>
        
        {/* iOS Instructions */}
        {isIOSDevice && showIOSInstructions && (
          <motion.div 
            className="mt-2 bg-white rounded-lg shadow-lg p-4 max-w-xs md:max-w-sm text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-primary mb-2">Install HabitVault on iOS</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Tap the <strong>Share</strong> button <span className="inline-block w-5 h-5 bg-gray-200 rounded-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-full h-full p-1">
                  <path d="M13 4.5a2.5 2.5 0 11.5 0 2.5 2.5 0 01-5 0zm-8 0a2.5 2.5 0 11.5 0 2.5 2.5 0 01-5 0zm0 11a2.5 2.5 0 11.5 0 2.5 2.5 0 01-5 0zm8 0a2.5 2.5 0 11.5 0 2.5 2.5 0 01-5 0z" />
                </svg>
              </span> at the bottom of your browser.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong> <span className="inline-block w-5 h-5 bg-gray-200 rounded-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-full h-full p-1">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </span>.</li>
              <li>Tap <strong>Add</strong> in the top-right corner.</li>
              <li>HabitVault will be added to your home screen.</li>
            </ol>
            <button 
              className="mt-3 text-xs text-primary font-medium"
              onClick={() => setShowIOSInstructions(false)}
            >
              Hide Instructions
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PWAInstallPrompt;