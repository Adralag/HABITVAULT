import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

export function useAuthentication() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, signup, logout, resetPassword } = useAuth();

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      setIsLoading(false);
      return user;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const handleSignup = async (email, password, username) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signup(email, password, username);
      setIsLoading(false);
      return user;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logout();
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const handlePasswordReset = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    handleLogin,
    handleSignup,
    handleLogout,
    handlePasswordReset,
    isLoading,
    error
  };
}