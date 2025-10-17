import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  auth,
  db 
} from './config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirebaseError } from './firebaseErrorUtils';

const AuthContext = createContext();

// Export the hook separately to keep the component file fast-refresh compatible
const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth };

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Handle authentication errors
   * @param {Error} error - The error object
   * @param {boolean} updateState - Whether to update the error state
   * @returns {Object} Standardized error object
   */
  const handleAuthError = (error, updateState = true) => {
    const standardError = handleFirebaseError(error, !updateState, 'Authentication');
    
    if (updateState) {
      setAuthError(standardError);
    }
    
    return standardError;
  };

  /**
   * Clear any authentication errors
   */
  const clearError = () => {
    setAuthError(null);
  };

  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} username - User display name
   * @returns {Promise<Object>} Firebase user object
   */
  async function signup(email, password, username) {
    clearError();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: username
      });
      
      // Create a user profile document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        username: username,
        displayName: username,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      return user;
    } catch (error) {
      const standardError = handleAuthError(error);
      throw standardError.originalError;
    }
  }

  /**
   * Log in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Firebase user object
   */
  async function login(email, password) {
    clearError();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      if (userCredential.user) {
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
      }
      
      return userCredential.user;
    } catch (error) {
      const standardError = handleAuthError(error);
      throw standardError.originalError;
    }
  }

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  async function logout() {
    clearError();
    
    try {
      await signOut(auth);
    } catch (error) {
      const standardError = handleAuthError(error);
      throw standardError.originalError;
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async function resetPassword(email) {
    clearError();
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const standardError = handleAuthError(error);
      throw standardError.originalError;
    }
  }

  /**
   * Update user profile in Firestore
   * @param {Object} user - Firebase user object
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object|null>} Updated user profile or null
   */
  async function updateUserProfile(userData) {
    clearError();
    
    if (!currentUser) {
      const error = new Error('User must be logged in to update profile');
      error.code = 'auth/no-current-user';
      const standardError = handleAuthError(error);
      throw standardError.originalError;
    }
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Add updated timestamp
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userDocRef, updateData, { merge: true });
      
      // Fetch and return the updated profile
      const updatedDoc = await getDoc(userDocRef);
      const updatedProfile = updatedDoc.data();
      
      // Update the profile in state
      setUserProfile(updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      const standardError = handleAuthError(error);
      throw standardError.originalError;
    }
  }

  /**
   * Set up auth state observer
   */
  const fetchUserProfileCallback = useCallback(async (user) => {
    if (!user) return null;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        // If profile doesn't exist but we have a user, create a minimal profile
        if (user.email) {
          const minimalProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          };
          
          await setDoc(userDocRef, minimalProfile);
          return minimalProfile;
        }
        return null;
      }
    } catch (error) {
      handleAuthError(error, false);
      return null;
    }
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      try {
        if (user) {
          const profile = await fetchUserProfileCallback(user);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        handleAuthError(error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      handleAuthError(error);
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchUserProfileCallback]);

  const value = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    loading,
    authError,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}