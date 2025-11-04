import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from './config';

/**
 * Upload profile picture to Firebase Storage
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise<string>} Download URL of uploaded image
 */
export const uploadProfilePicture = async (userId, file) => {
  if (!userId) throw new Error('User ID is required');
  if (!file) throw new Error('File is required');

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB. Please upload a smaller image.');
  }

  try {
    // Create a reference to the storage location
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `users/${userId}/profile/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

/**
 * Delete profile picture from Firebase Storage
 * @param {string} photoURL - Photo URL to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteProfilePicture = async (photoURL) => {
  if (!photoURL) return false;

  try {
    // Extract the file path from the URL
    const fileRef = ref(storage, photoURL);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    // If file doesn't exist, that's okay
    if (error.code === 'storage/object-not-found') {
      return true;
    }
    console.error('Error deleting profile picture:', error);
    throw error;
  }
};

/**
 * Get profile picture URL or default avatar
 * @param {string} photoURL - User's photo URL
 * @param {string} displayName - User's display name for generating initials
 * @returns {string} Photo URL or data URI for default avatar
 */
export const getProfilePictureURL = (photoURL, displayName) => {
  if (photoURL) {
    return photoURL;
  }

  // Generate initials avatar
  const initials = displayName
    ? displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?';

  // Create a simple SVG avatar with initials
  const svg = `
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="#8b5cf6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="48" fill="white" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Update user profile with new photo URL and/or display name
 * @param {Object} user - Firebase auth user object
 * @param {string} photoURL - URL of the new photo
 * @param {string} displayName - Optional display name to update
 * @returns {Promise<boolean>} Success status
 */
export const updateUserProfile = async (user, photoURL = null, displayName = null) => {
  if (!user) throw new Error('User is required');
  
  try {
    const updates = {};
    
    if (photoURL !== null && photoURL !== undefined) {
      updates.photoURL = photoURL;
    }
    
    if (displayName !== null && displayName !== undefined) {
      updates.displayName = displayName;
    }
    
    if (Object.keys(updates).length === 0) {
      return true; // Nothing to update
    }
    
    await updateProfile(user, updates);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Upload and update profile picture
 * @param {Object} user - Firebase auth user object
 * @param {File} file - Image file
 * @returns {Promise<string>} Download URL of uploaded image
 */
export const uploadAndUpdateProfilePicture = async (user, file) => {
  if (!user) throw new Error('User is required');
  
  try {
    // Upload new profile picture
    const photoURL = await uploadProfilePicture(user.uid, file);
    
    // Update user profile
    await updateUserProfile(user, photoURL);
    
    return photoURL;
  } catch (error) {
    console.error('Error uploading and updating profile picture:', error);
    throw error;
  }
};
