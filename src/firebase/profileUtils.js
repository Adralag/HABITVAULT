import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// Check if user has completed onboarding
export const hasCompletedOnboarding = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data();
    return userData.hasCompletedOnboarding === true;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

// Save user profile during onboarding
export const saveUserProfile = async (userId, profileData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update existing user document
      await updateDoc(userDocRef, {
        ...profileData,
        hasCompletedOnboarding: true,
        updatedAt: new Date()
      });
    } else {
      // Create new user document
      await setDoc(userDocRef, {
        uid: userId,
        ...profileData,
        hasCompletedOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile data
export const getUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update specific profile fields
export const updateUserProfile = async (userId, updates) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};