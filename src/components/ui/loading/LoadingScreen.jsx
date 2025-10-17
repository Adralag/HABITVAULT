import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../Logo';

/**
 * Loading screen component shown during page transitions
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Whether the loading screen is visible
 */
const LoadingScreen = ({ isVisible = true }) => {
  // If not visible, don't render anything
  if (!isVisible) return null;
  
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-b from-primary to-primary/90 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Logo size="lg" />
        <motion.h2 
          className="text-white font-poppins font-bold text-2xl mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          HabitVault
        </motion.h2>
      </motion.div>
      
      <motion.div 
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-2">
          <motion.div
            className="w-3 h-3 bg-secondary rounded-full"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.8,
              delay: 0
            }}
          />
          <motion.div
            className="w-3 h-3 bg-accent rounded-full"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.8,
              delay: 0.2
            }}
          />
          <motion.div
            className="w-3 h-3 bg-secondary rounded-full"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.8,
              delay: 0.4
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;