import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { handleFirebaseError } from './firebaseErrorUtils';

/**
 * Default user settings
 * These will be used when creating new user settings
 */
const DEFAULT_USER_SETTINGS = {
  appearance: {
    theme: 'system', // 'light', 'dark', 'system'
  },
  security: {
    dataExport: 'encrypted', // 'encrypted', 'plaintext'
    encryptionKey: null,     // User's encryption key (will be generated)
  },
  notifications: {
    enabled: true,            // Master toggle for notifications
    emailNotifications: false, // Email notifications
    reminders: true,          // Daily reminders
  },
  regional: {
    language: 'en',           // Default language
    timezone: 'UTC',          // Default timezone
    weekStart: 'monday',      // First day of week
  }
};

/**
 * Generate a random encryption key
 * @returns {string} - Random encryption key
 */
const generateEncryptionKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let key = '';
  
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return key;
};

/**
 * Subscribe to user settings changes
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function that receives settings and error
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToUserSettings = (userId, callback) => {
  if (!userId) {
    callback(null, new Error('No user ID provided'));
    return () => {};
  }

  const userSettingsRef = doc(db, 'userSettings', userId);
  
  // We don't use onSnapshot here because settings don't change frequently
  // and we want to avoid unnecessary re-renders
  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(userSettingsRef);
      
      if (docSnap.exists()) {
        // Settings exist, return them
        callback(docSnap.data(), null);
      } else {
        // Create default settings for new users
        const newSettings = {
          ...DEFAULT_USER_SETTINGS,
          security: {
            ...DEFAULT_USER_SETTINGS.security,
            encryptionKey: generateEncryptionKey(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await setDoc(userSettingsRef, newSettings);
        callback(newSettings, null);
      }
    } catch (error) {
      callback(null, handleFirebaseError(error));
    }
  };
  
  // Initial fetch
  fetchSettings();
  
  // Return function that can be used to manually refresh settings
  return fetchSettings;
};

/**
 * Get user settings
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User settings
 */
export const getUserSettings = async (userId) => {
  if (!userId) {
    throw new Error('No user ID provided');
  }
  
  try {
    const settingsDoc = await getDoc(doc(db, 'userSettings', userId));
    
    if (settingsDoc.exists()) {
      return settingsDoc.data();
    } else {
      // Create default settings
      const newSettings = {
        ...DEFAULT_USER_SETTINGS,
        security: {
          ...DEFAULT_USER_SETTINGS.security,
          encryptionKey: generateEncryptionKey(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'userSettings', userId), newSettings);
      return newSettings;
    }
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Update user settings
 * @param {string} userId - User ID
 * @param {Object} settings - Updated settings object
 * @returns {Promise<Object>} - Updated settings
 */
export const updateUserSettings = async (userId, settings) => {
  if (!userId) {
    throw new Error('No user ID provided');
  }
  
  try {
    const userSettingsRef = doc(db, 'userSettings', userId);
    
    // Add updated timestamp
    const updatedSettings = {
      ...settings,
      updatedAt: new Date(),
    };
    
    await updateDoc(userSettingsRef, updatedSettings);
    
    return updatedSettings;
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Update a specific section of user settings
 * @param {string} userId - User ID
 * @param {string} section - Settings section (e.g., 'appearance', 'security')
 * @param {Object} sectionData - Section data to update
 * @returns {Promise<Object>} - Updated section data
 */
export const updateSettingsSection = async (userId, section, sectionData) => {
  if (!userId) {
    throw new Error('No user ID provided');
  }
  
  if (!Object.keys(DEFAULT_USER_SETTINGS).includes(section)) {
    throw new Error(`Invalid settings section: ${section}`);
  }
  
  try {
    const userSettingsRef = doc(db, 'userSettings', userId);
    
    // Get current settings
    const currentSettings = await getUserSettings(userId);
    
    // Create update object with dot notation for the specific section
    const updateObj = {
      [`${section}`]: {
        ...currentSettings[section],
        ...sectionData,
      },
      updatedAt: new Date(),
    };
    
    await updateDoc(userSettingsRef, updateObj);
    
    return updateObj[section];
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Reset all settings to defaults
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Default settings
 */
export const resetAllSettings = async (userId) => {
  if (!userId) {
    throw new Error('No user ID provided');
  }
  
  try {
    const newSettings = {
      ...DEFAULT_USER_SETTINGS,
      security: {
        ...DEFAULT_USER_SETTINGS.security,
        encryptionKey: generateEncryptionKey(),
      },
      updatedAt: new Date(),
    };
    
    await setDoc(doc(db, 'userSettings', userId), newSettings);
    
    return newSettings;
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Generate a new encryption key for the user
 * @param {string} userId - User ID
 * @returns {Promise<string>} - New encryption key
 */
export const regenerateEncryptionKey = async (userId) => {
  if (!userId) {
    throw new Error('No user ID provided');
  }
  
  try {
    const userSettingsRef = doc(db, 'userSettings', userId);
    const newKey = generateEncryptionKey();
    
    await updateDoc(userSettingsRef, {
      'security.encryptionKey': newKey,
      updatedAt: new Date(),
    });
    
    return newKey;
  } catch (error) {
    throw handleFirebaseError(error);
  }
};