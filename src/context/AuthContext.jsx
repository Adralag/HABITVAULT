import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user was previously logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('habitvault_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // This is a placeholder for Firebase authentication
    // Will be replaced with actual Firebase auth when implemented
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful login
        const user = { 
          uid: 'mock-user-id', 
          email, 
          displayName: email.split('@')[0] 
        };
        setCurrentUser(user);
        localStorage.setItem('habitvault_user', JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  };

  // Signup function
  const signup = (email, password, displayName) => {
    // This is a placeholder for Firebase authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful signup
        const user = { 
          uid: 'mock-user-id', 
          email, 
          displayName: displayName || email.split('@')[0] 
        };
        setCurrentUser(user);
        localStorage.setItem('habitvault_user', JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    // This is a placeholder for Firebase authentication
    return new Promise((resolve) => {
      setCurrentUser(null);
      localStorage.removeItem('habitvault_user');
      resolve();
    });
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};