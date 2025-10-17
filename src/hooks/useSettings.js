import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import * as userSettingsServices from '../firebase/userSettingsServices';
import useFirebaseOperation from './useFirebaseOperation';
import { handleFirebaseError } from '../firebase/firebaseErrorUtils';

/**
 * Custom hook for managing user settings
 * @returns {Object} - Settings related data and functions
 */
export function useSettings() {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  // Use Firebase operation hook for handling loading states and errors
  const {
    isLoading,
    error,
    clearError,
    handleError,
    executeOperation
  } = useFirebaseOperation('Settings');

  // Subscribe to user settings when component mounts
  useEffect(() => {
    if (!currentUser) {
      setSettings(null);
      setIsLoadingInitial(false);
      return () => {};
    }
    
    setIsLoadingInitial(true);
    
    const refreshSettings = userSettingsServices.subscribeToUserSettings(
      currentUser.uid,
      (settingsData, err) => {
        if (err) {
          handleError(err);
        } else {
          setSettings(settingsData);
          clearError();
        }
        setIsLoadingInitial(false);
      }
    );
    
    // Return refresh function (no cleanup needed)
    return refreshSettings;
  }, [currentUser, handleError, clearError]);
  
  /**
   * Check if user is authenticated
   * @returns {Error} Error if not authenticated
   */
  const checkAuth = useCallback(() => {
    if (!currentUser) {
      const error = new Error('User not authenticated');
      error.code = 'auth/no-current-user';
      return error;
    }
    return null;
  }, [currentUser]);
  
  /**
   * Update the entire settings object
   * @param {Object} settingsData - Complete settings data
   * @returns {Promise<Object>} - Updated settings
   */
  const updateSettings = useCallback(async (settingsData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const updatedSettings = await userSettingsServices.updateUserSettings(
        currentUser.uid,
        settingsData
      );
      setSettings(updatedSettings);
      return updatedSettings;
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Update a specific section of settings
   * @param {string} section - Section name (e.g., 'appearance', 'security')
   * @param {Object} sectionData - Section data to update
   * @returns {Promise<Object>} - Updated section data
   */
  const updateSection = useCallback(async (section, sectionData) => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const updatedSection = await userSettingsServices.updateSettingsSection(
        currentUser.uid,
        section,
        sectionData
      );
      
      // Update local state with new section data
      setSettings(prevSettings => ({
        ...prevSettings,
        [section]: {
          ...prevSettings[section],
          ...sectionData,
        },
        updatedAt: new Date(),
      }));
      
      return updatedSection;
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Reset all settings to defaults
   * @returns {Promise<Object>} - Default settings
   */
  const resetAllSettings = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const defaultSettings = await userSettingsServices.resetAllSettings(
        currentUser.uid
      );
      setSettings(defaultSettings);
      return defaultSettings;
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  /**
   * Generate a new encryption key
   * @returns {Promise<string>} - New encryption key
   */
  const regenerateEncryptionKey = useCallback(async () => {
    const authError = checkAuth();
    if (authError) {
      throw handleFirebaseError(authError).originalError;
    }
    
    return executeOperation(async () => {
      const newKey = await userSettingsServices.regenerateEncryptionKey(
        currentUser.uid
      );
      
      // Update local state
      setSettings(prevSettings => ({
        ...prevSettings,
        security: {
          ...prevSettings.security,
          encryptionKey: newKey,
        },
        updatedAt: new Date(),
      }));
      
      return newKey;
    }, { throwError: true });
  }, [currentUser, executeOperation, checkAuth]);
  
  // Helper functions for common settings sections
  
  /**
   * Update appearance settings
   * @param {Object} appearanceData - Appearance settings
   * @returns {Promise<Object>} - Updated appearance settings
   */
  const updateAppearance = useCallback((appearanceData) => {
    return updateSection('appearance', appearanceData);
  }, [updateSection]);
  
  /**
   * Update security settings
   * @param {Object} securityData - Security settings
   * @returns {Promise<Object>} - Updated security settings
   */
  const updateSecurity = useCallback((securityData) => {
    return updateSection('security', securityData);
  }, [updateSection]);
  
  /**
   * Update notification settings
   * @param {Object} notificationData - Notification settings
   * @returns {Promise<Object>} - Updated notification settings
   */
  const updateNotifications = useCallback((notificationData) => {
    return updateSection('notifications', notificationData);
  }, [updateSection]);
  
  /**
   * Update regional settings
   * @param {Object} regionalData - Regional settings
   * @returns {Promise<Object>} - Updated regional settings
   */
  const updateRegional = useCallback((regionalData) => {
    return updateSection('regional', regionalData);
  }, [updateSection]);
  
  // Combine initial loading state with operation loading state
  const loading = isLoadingInitial || isLoading;
  
  return {
    settings,
    loading,
    error,
    clearError,
    updateSettings,
    updateSection,
    updateAppearance,
    updateSecurity,
    updateNotifications,
    updateRegional,
    resetAllSettings,
    regenerateEncryptionKey
  };
}

export default useSettings;