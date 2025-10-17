import React from 'react';
import Logo from '../ui/Logo';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <motion.header 
      className="bg-gradient-to-b from-primary to-primary/90 shadow-sm fixed w-full z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div 
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Logo size="sm" />
            <span className="ml-2 text-xl font-bold text-white font-poppins">HabitVault</span>
          </motion.div>
          
          {/* Auth buttons - visible on all screens */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login" 
                className="text-white hover:text-secondary font-medium text-sm sm:text-base transition-colors"
              >
                Log in
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Link
                to="/signup"
                className="bg-gradient-to-r from-accent to-secondary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-medium transition-all shadow-md hover:shadow-lg block"
              >
                Sign up
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;