import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'           
import { useAuth } from './firebase/AuthContext'
import { UserProvider } from './context/UserContext'
import { useState } from 'react'
import RouteTransition from './components/layout/RouteTransition'

// Public Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'

// Guards
import OnboardingGuard from './components/guards/OnboardingGuard'

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage'
import HabitsPage from './pages/habits/HabitsPage'
import HabitDetailPage from './pages/habits/HabitDetailPage'
import ProgressPage from './pages/dashboard/progress/ProgressPage'
import GoalsAndStreaksPage from './pages/dashboard/GoalsAndStreaksPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import SettingsPage from './pages/dashboard/SettingsPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Another version that takes a fallback path instead of using login by default
const RequireAuth = ({ children, fallback = "/login" }) => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <UserProvider>
          <RouteTransition>
            <Routes>
              {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<Navigate to="/login" />} />
          <Route path="/terms" element={<Navigate to="/" />} />
          <Route path="/privacy" element={<Navigate to="/" />} />
          
          {/* Onboarding Route */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />
          
          {/* Protected Dashboard Routes with Onboarding Guard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <OnboardingGuard>
                <DashboardPage />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/habits" element={
            <ProtectedRoute>
              <OnboardingGuard>
                <HabitsPage />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/habits/:habitId" element={
            <ProtectedRoute>
              <OnboardingGuard>
                <HabitDetailPage />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/progress" element={
            <ProtectedRoute>
              <OnboardingGuard>
                <ProgressPage />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/goals" element={
            <ProtectedRoute>
              <OnboardingGuard>
                <GoalsAndStreaksPage />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <OnboardingGuard>
                <NotificationsPage />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <OnboardingGuard>
                <SettingsPage />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          
          {/* Fallback Route - Redirect to dashboard if logged in, otherwise home */}
          <Route path="*" element={
            <RequireAuth fallback="/">
              <Navigate to="/dashboard" replace />
            </RequireAuth>
          } />
            </Routes>
          </RouteTransition>
        </UserProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
