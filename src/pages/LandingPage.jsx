import React from 'react';
import Logo from '../components/ui/Logo';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Feature card component for landing page
const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
    variants={fadeIn}
    whileHover={{ 
      y: -5, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
  >
    <div className="text-accent mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 font-poppins text-primary">{title}</h3>
    <p className="text-gray-600 font-inter">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-b from-primary to-primary/90 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="flex flex-col items-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Logo size="xl" />
              <motion.h2 
                className="text-white font-poppins font-bold text-4xl mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                HabitVault
              </motion.h2>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-poppins mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Secure Your Habits
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-10 font-inter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Build consistent routines while maintaining complete data privacy through end-to-end encryption.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="btn-primary inline-block bg-gradient-to-r from-accent to-secondary text-white px-6 py-3 rounded-md font-medium transition-all text-center shadow-md"
                >
                  Get Started
                </Link>
              </motion.div>
              <motion.a
                href="#features"
                className="btn-secondary inline-block bg-white/10 text-white px-6 py-3 rounded-md font-medium transition-all text-center border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-poppins text-primary mb-4">Key Features</h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Our app is designed to help you build better habits while keeping your personal data private and secure.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <FeatureCard
              icon={
                <motion.svg 
                  className="w-12 h-12" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, repeatType: "mirror", duration: 3 }}
                >
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H5.5z"></path>
                  <path d="M9 13h2m-1-3v2m-2 4h4m4-3l-4 4m0-4l4 4" strokeWidth="2" stroke="currentColor" fill="none"></path>
                </motion.svg>
              }
              title="End-to-End Encryption"
              description="All your habit data is encrypted on your device before being stored in the cloud, ensuring only you can access it."
              index={0}
            />
            
            <FeatureCard
              icon={
                <motion.svg 
                  className="w-12 h-12" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </motion.svg>
              }
              title="Habit Management"
              description="Create, update, and track habits with an intuitive interface designed for daily consistency and growth."
              index={1}
            />
            
            <FeatureCard
              icon={
                <motion.svg 
                  className="w-12 h-12" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </motion.svg>
              }
              title="Progress Analytics"
              description="Visualize your consistency and completion rates with interactive charts and detailed statistics."
              index={2}
            />
            
            <FeatureCard
              icon={
                <motion.svg 
                  className="w-12 h-12" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </motion.svg>
              }
              title="Customizable Notifications"
              description="Set personalized reminders to help you stay on track with your habit goals."
              index={3}
            />
            
            <FeatureCard
              icon={
                <motion.svg 
                  className="w-12 h-12" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 6 }}
                >
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                </motion.svg>
              }
              title="Data Export & Backup"
              description="Export your data or create encrypted backups to ensure you never lose your progress."
              index={4}
            />
            
            <FeatureCard
              icon={
                <motion.svg 
                  className="w-12 h-12" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </motion.svg>
              }
              title="Multiple Device Sync"
              description="Access your habits from any device while maintaining the same level of security and encryption."
              index={5}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section 
        id="security" 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >

        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold font-poppins text-primary mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Privacy First, Always
              </motion.h2>
              <motion.p 
                className="text-gray-600 font-inter"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                We've built HabitVault with security as our top priority. Here's how we protect your data:
              </motion.p>
            </div>
            
            <motion.div 
              className="bg-gray-50 p-8 rounded-lg shadow-md mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <h3 className="text-xl font-semibold mb-4 font-poppins text-primary">End-to-End Encryption</h3>
              <p className="mb-4 text-gray-600 font-inter">
                All your habit data is encrypted using AES-256 bit encryption before it ever leaves your device. 
                Even we can't read your data - only you have the keys.
              </p>
              
              <motion.div 
                className="bg-black p-4 rounded font-jetbrains text-sm mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.code
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1, scale: 1.02 }}
                >
                  // Data is encrypted before storage<br />
                  const encryptedData = CryptoJS.AES.encrypt(<br />
                  &nbsp;&nbsp;JSON.stringify(habitData),<br />
                  &nbsp;&nbsp;userEncryptionKey<br />
                  ).toString();
                </motion.code>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg shadow-md"
                variants={fadeIn}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold mb-3 font-poppins text-primary">No Third-Party Analytics</h3>
                <p className="text-gray-600 font-inter">
                  We don't include any third-party analytics or tracking tools. Your habits remain completely private.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg shadow-md"
                variants={fadeIn}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold mb-3 font-poppins text-primary">Local-First Storage</h3>
                <p className="text-gray-600 font-inter">
                  Your habits are stored locally first and then synced to the cloud with encryption, ensuring your data is always available.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-accent to-secondary text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold font-poppins mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to secure your habits?
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of users who are building better habits while keeping their data private.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/signup"
                className="bg-white text-primary px-6 py-3 rounded-md font-medium shadow-md inline-block"
              >
                Create Account
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium inline-block"
              >
                Log In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </MainLayout>
  );
};

export default LandingPage;