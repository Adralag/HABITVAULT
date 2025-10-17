// Export Firebase config
export { app, auth, db, storage, analytics } from './config';

// Export Firebase authentication
export { AuthProvider, useAuth } from './AuthContext.jsx';
export { useAuthentication } from './useAuthentication';

// Export Firebase Firestore utils
export * from './habitUtils';
export * from './habitServices';
export * from './profileUtils';