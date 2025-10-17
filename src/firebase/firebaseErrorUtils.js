import { standardizeError, logError } from '../utils/errorUtils';

/**
 * Formats Firebase-specific error messages to be more user-friendly
 * @param {Error} error - Firebase error object
 * @returns {string} Formatted error message
 */
export const formatFirebaseErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Extract the error code if available
  const errorCode = error.code || '';
  
  // Auth-related errors
  if (errorCode.startsWith('auth/')) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters with a mix of letters and numbers.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/requires-recent-login':
        return 'This action requires a recent login. Please log out and log back in.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completion.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled for this project.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials.';
      case 'auth/network-request-failed':
        return 'A network error occurred. Check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Access has been temporarily disabled due to many failed login attempts. Try again later.';
      case 'auth/user-token-expired':
        return 'Your session has expired. Please log in again.';
      default:
        return error.message || 'An authentication error occurred.';
    }
  }
  
  // Firestore-related errors
  if (errorCode.startsWith('firestore/')) {
    switch (errorCode) {
      case 'firestore/permission-denied':
        return 'You don\'t have permission to access this data.';
      case 'firestore/not-found':
        return 'The requested document was not found.';
      case 'firestore/already-exists':
        return 'The document already exists.';
      case 'firestore/failed-precondition':
        return 'Operation failed because prerequisites weren\'t met.';
      case 'firestore/aborted':
        return 'The operation was aborted.';
      case 'firestore/out-of-range':
        return 'Operation was attempted past the valid range.';
      case 'firestore/unavailable':
        return 'The database service is currently unavailable. Please try again later.';
      case 'firestore/data-loss':
        return 'Unrecoverable data loss or corruption.';
      case 'firestore/unauthenticated':
        return 'Your session has expired. Please log in again to continue.';
      default:
        return error.message || 'A database error occurred.';
    }
  }
  
  // Storage-related errors
  if (errorCode.startsWith('storage/')) {
    switch (errorCode) {
      case 'storage/unknown':
        return 'An unknown error occurred during file upload.';
      case 'storage/object-not-found':
        return 'The file does not exist.';
      case 'storage/bucket-not-found':
        return 'The storage bucket does not exist.';
      case 'storage/project-not-found':
        return 'The Firebase project was not found.';
      case 'storage/quota-exceeded':
        return 'Storage quota has been exceeded. Please contact support.';
      case 'storage/unauthenticated':
        return 'User is not authenticated. Please log in again.';
      case 'storage/unauthorized':
        return 'You do not have permission to access this file.';
      case 'storage/retry-limit-exceeded':
        return 'Maximum retry time for operation exceeded. Please try again.';
      case 'storage/invalid-checksum':
        return 'File upload failed due to checksum mismatch.';
      case 'storage/canceled':
        return 'User canceled the file upload.';
      default:
        return error.message || 'A file storage error occurred.';
    }
  }
  
  // Generic Firebase errors
  switch (errorCode) {
    case 'app/network-error':
    case 'messaging/failed-service-worker-registration':
    case 'messaging/no-sw-in-reg':
      return 'A network error occurred. Please check your connection and try again.';
    case 'app/app-deleted':
    case 'app/app-not-authorized':
    case 'app/invalid-app-name':
    case 'app/invalid-app-argument':
      return 'Application initialization error. Please contact support.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Handles Firebase errors with proper formatting and variant determination
 * @param {Error} error - Firebase error object
 * @param {boolean} silent - Whether to suppress logging
 * @param {string} context - Context where the error occurred
 * @returns {Object} Standardized error object
 */
export const handleFirebaseError = (error, silent = false, context = 'Firebase') => {
  if (!error) return null;
  
  // Format the error message
  const formattedMessage = formatFirebaseErrorMessage(error);
  
  // Determine the error variant based on the error code
  let variant = 'default';
  const errorCode = error.code || '';
  
  if (errorCode === 'auth/network-request-failed' || 
      errorCode === 'app/network-error' ||
      errorCode === 'firestore/unavailable' ||
      error.message?.includes('network') || 
      error.message?.includes('connection')) {
    variant = 'network';
  } else if (errorCode === 'auth/user-not-found' || 
             errorCode === 'auth/wrong-password' || 
             errorCode === 'auth/invalid-credential' ||
             errorCode === 'auth/user-disabled' ||
             errorCode === 'auth/user-token-expired' ||
             errorCode === 'auth/requires-recent-login' ||
             errorCode === 'firestore/unauthenticated' ||
             errorCode === 'storage/unauthenticated') {
    variant = 'auth';
  } else if (errorCode === 'firestore/not-found' ||
             errorCode === 'storage/object-not-found') {
    variant = 'notFound';
  }
  
  // Create standardized error object
  const standardError = {
    message: formattedMessage,
    variant,
    originalError: error,
    code: errorCode
  };
  
  // Log error if not silent
  if (!silent) {
    logError(error, `${context} Error (${errorCode})`);
  }
  
  return standardError;
};

export default {
  formatFirebaseErrorMessage,
  handleFirebaseError
};