
<div align="center">
  <img src="./assets/logo.png" alt="HabitVault Logo" width="120" height="120" />
  
  # HabitVault
  
  ### Build Better Habits, Track Your Progress, Achieve Your Goals
  
  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-12.4.0-FFCA28?logo=firebase)](https://firebase.google.com/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

  **A modern, feature-rich Progressive Web App (PWA) for habit tracking and personal growth**

  [Live Demo](https://habitvault.vercel.app) • [Report Bug](https://github.com/Osaseye/HABITVAULT/issues) • [Request Feature](https://github.com/Osaseye/HABITVAULT/issues)
</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Application Features](#-application-features)
- [PWA Capabilities](#-pwa-capabilities)
- [Firebase Integration](#-firebase-integration)
- [Team Contributions](#-team-contributions)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

**HabitVault** is a comprehensive habit tracking application designed to help users build and maintain positive habits through:

- 📊 **Visual Progress Tracking** - Beautiful charts and statistics
- 🎨 **Modern UI/UX** - Clean, intuitive interface with dark/light themes
- 🔔 **Smart Reminders** - Customizable notifications for each habit
- 🏆 **Goals & Achievements** - Set milestones and track streaks
- 📱 **PWA Support** - Install on any device, works offline
- 🔐 **Secure Authentication** - Firebase-powered user accounts
- ☁️ **Cloud Sync** - Access your data from anywhere
- 🎯 **Personalization** - Profile pictures, display names, and custom settings

### Built By
**Group Assignment - 8 Team Members**  
Lead Developer: Adebowale Oluwasegun (sadebowale092@gmail.com)

---

## ✨ Key Features

### 🎯 Habit Management
- Create, edit, and delete habits with custom names, descriptions, and icons
- Set frequency goals (daily, weekly, custom schedules)
- Mark habits as complete with visual check-off
- Archive completed or inactive habits
- View detailed habit history and analytics

### 📊 Progress Tracking
- Visual streak counters with flame animations
- Completion rate percentages and charts
- Weekly/monthly/yearly progress views
- Heatmap calendar showing consistency
- Recharts-powered analytics dashboard

### 🔔 Smart Notifications
- Browser push notifications for habit reminders
- Customizable reminder times for each habit
- Multiple reminders per day support
- Quiet hours configuration
- In-app notification history

### 🏆 Goals & Achievements
- Set daily/weekly/monthly habit goals
- Track longest streaks and perfect weeks
- Achievement badges and milestones
- Motivational statistics and insights
- Goal completion celebrations

### 👤 User Profile
- Custom profile pictures (upload to Firebase Storage)
- Display name personalization
- Theme preferences (dark/light mode)
- Notification settings management
- Account security options

### 🌐 Progressive Web App
- Installable on desktop and mobile
- Offline functionality with service workers
- App-like experience with no browser chrome
- Auto-updates in background
- Cached data for offline access

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Latest React with concurrent features
- **React Router v7.9.4** - Client-side routing with data loading
- **Framer Motion 12.23.24** - Smooth animations and transitions

### Styling & UI
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS transformation and autoprefixing
- **Headless UI 2.2.9** - Unstyled accessible components

### Data Visualization
- **Recharts 3.2.1** - Composable charting library for React

### Backend & Services
- **Firebase 12.4.0**
  - Firebase Authentication (Email/Password, OAuth ready)
  - Cloud Firestore (NoSQL database)
  - Firebase Storage (Profile pictures, assets)
  - Firebase Analytics (Usage tracking)
  - Cloud Messaging (Push notifications)

### Build Tools & Development
- **Vite 7.1.7** - Next-generation frontend tooling
- **ESLint 9.36.0** - Code quality and consistency
- **vite-plugin-pwa 1.1.0** - PWA capabilities

### Deployment
- **Vercel** - Serverless deployment platform
- **GitHub** - Version control and collaboration

---

## 📁 Project Structure

```
HABITVAULT/
├── public/                          # Static assets
│   ├── manifest.json               # PWA manifest
│   ├── pwa-192x192.png.png         # App icon (192x192)
│   ├── pwa-512x512.png.png         # App icon (512x512)
│   ├── apple-touch-icon.png        # iOS app icon
│   └── favicon.ico                 # Browser favicon
│
├── src/
│   ├── assets/                     # Images, fonts, static files
│   │   └── react.svg
│   │
│   ├── components/                 # Reusable React components
│   │   ├── auth/                   # Authentication components
│   │   │   └── ProtectedRoute.jsx  # Route guard for authenticated users
│   │   │
│   │   ├── common/                 # Shared components
│   │   │   └── DataFetchExample.jsx
│   │   │
│   │   ├── errors/                 # Error handling components
│   │   │   ├── ErrorBoundary.jsx   # React error boundary
│   │   │   ├── ErrorMessage.jsx    # Error display component
│   │   │   ├── EmptyState.jsx      # Empty state placeholder
│   │   │   └── FormFieldError.jsx  # Form validation errors
│   │   │
│   │   ├── firebase/               # Firebase-specific components
│   │   │   ├── FirebaseErrorHandler.jsx
│   │   │   └── WithFirebaseOperationState.jsx
│   │   │
│   │   ├── guards/                 # Route guards
│   │   │   └── OnboardingGuard.jsx # Ensures onboarding completion
│   │   │
│   │   ├── habits/                 # Habit-related components
│   │   │   └── HabitList.jsx       # Habit list container
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardLayout.jsx    # Main dashboard wrapper
│   │   │   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   │   │   └── Header.jsx             # Top header bar
│   │   │   ├── MainLayout.jsx      # Public pages layout
│   │   │   └── RouteTransition.jsx # Page transition animations
│   │   │
│   │   ├── loading/                # Loading states
│   │   │   ├── LoadingSpinner.jsx  # Spinner component
│   │   │   └── CardSkeleton.jsx    # Skeleton loader
│   │   │
│   │   ├── pwa/                    # PWA components
│   │   │   ├── PWAInstallPrompt.jsx # Install prompt modal
│   │   │   └── PWAStatus.jsx       # Online/offline indicator
│   │   │
│   │   ├── ui/                     # UI components
│   │   │   ├── dashboard/
│   │   │   │   ├── Card.jsx        # Dashboard card wrapper
│   │   │   │   ├── HabitCard.jsx   # Individual habit card
│   │   │   │   ├── HabitModal.jsx  # Create/edit habit modal
│   │   │   │   ├── HabitForm.jsx   # Habit form fields
│   │   │   │   └── HabitViewModal.jsx # View habit details
│   │   │   ├── notifications/
│   │   │   │   ├── ReminderForm.jsx       # Reminder setup form
│   │   │   │   └── NotificationDropdown.jsx # Notification list
│   │   │   ├── Logo.jsx            # App logo component
│   │   │   └── Button.jsx          # Reusable button
│   │   │
│   │   ├── OfflineFallback.jsx     # Offline page
│   │   └── OfflineWrapper.jsx      # Offline detection wrapper
│   │
│   ├── context/                    # React Context providers
│   │   ├── AuthContext.jsx         # Authentication state
│   │   ├── UserContext.jsx         # User profile data
│   │   ├── ThemeContext.jsx        # Dark/light theme
│   │   └── OnlineStatusContext.jsx # Network status
│   │
│   ├── firebase/                   # Firebase configuration & services
│   │   ├── config.js               # Firebase initialization
│   │   ├── AuthContext.jsx         # Auth provider (duplicate)
│   │   ├── useAuthentication.js    # Auth hook
│   │   ├── firebaseErrorUtils.js   # Error handling utilities
│   │   ├── habitServices.js        # Habit CRUD operations
│   │   ├── habitUtils.js           # Habit helper functions
│   │   ├── goalServices.js         # Goal management
│   │   ├── progressServices.js     # Progress tracking
│   │   ├── reminderServices.js     # Reminder management
│   │   ├── notificationServices.js # Notification handling
│   │   ├── profileUtils.js         # User profile utilities
│   │   ├── storageServices.js      # Firebase Storage operations
│   │   ├── userSettingsServices.js # Settings management
│   │   └── index.js                # Barrel export
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useHabits.jsx           # Habits data hook
│   │   ├── useHabit.jsx            # Single habit hook
│   │   ├── useGoals.js             # Goals data hook
│   │   ├── useProgress.js          # Progress tracking hook
│   │   ├── useReminders.js         # Reminders hook
│   │   ├── useNotifications.js     # Notifications hook
│   │   ├── useReminderNotifications.js # Reminder notifications
│   │   ├── useSettings.js          # Settings hook
│   │   ├── useHabitProgress.js     # Habit progress calculations
│   │   ├── useErrorHandler.js      # Error handling hook
│   │   ├── useFirebaseErrorHandler.js # Firebase errors
│   │   └── useFirebaseOperation.js # Firebase operation wrapper
│   │
│   ├── pages/                      # Page components
│   │   ├── auth/                   # Authentication pages
│   │   │   └── LoginPage.jsx       # Alternative login page
│   │   │
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── DashboardPage.jsx   # Main dashboard
│   │   │   ├── SettingsPage.jsx    # User settings
│   │   │   ├── GoalsAndStreaksPage.jsx # Goals overview
│   │   │   └── progress/
│   │   │       └── ProgressPage.jsx # Progress analytics
│   │   │
│   │   ├── habits/                 # Habit pages
│   │   │   ├── HabitsPage.jsx      # All habits view
│   │   │   └── HabitDetailPage.jsx # Single habit details
│   │   │
│   │   ├── notifications/          # Notification pages
│   │   │   └── NotificationsPage.jsx # Reminders & notifications
│   │   │
│   │   ├── LandingPage.jsx         # Public landing page
│   │   ├── LoginPage.jsx           # Login page
│   │   ├── SignupPage.jsx          # Registration page
│   │   ├── ForgotPasswordPage.jsx  # Password reset
│   │   └── OnboardingPage.jsx      # New user onboarding
│   │
│   ├── services/                   # Service layer
│   │   └── notificationManager.js  # Browser notification API
│   │
│   ├── utils/                      # Utility functions
│   │
│   ├── examples/                   # Example components (for reference)
│   │
│   ├── App.jsx                     # Root app component
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Global styles
│   └── pwa.js                      # PWA service worker registration
│
├── .env.local                      # Environment variables (gitignored)
├── .gitignore                      # Git ignore rules
├── cors.json                       # Firebase Storage CORS config
├── storage.rules                   # Firebase Storage security rules
├── firestore.rules                 # Firestore security rules
├── eslint.config.js                # ESLint configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── vite.config.js                  # Vite build configuration
├── vercel.json                     # Vercel deployment config
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Git** for version control
- **Firebase Account** (free tier works)
- **Code Editor** (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Osaseye/HABITVAULT.git
   cd HABITVAULT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

---

## 🔧 Environment Setup

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create a **Firestore Database**
4. Enable **Firebase Storage**
5. Copy your Firebase config to `.env.local`

### Firebase Storage CORS Setup

To allow profile picture uploads, configure CORS:

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Run the setup script:
   ```powershell
   .\setup-cors.ps1
   ```

Or manually:
```bash
gsutil cors set cors.json gs://your-bucket-name.appspot.com
```

### Firestore Security Rules

Deploy the security rules from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

### Storage Security Rules

Deploy from `storage.rules`:

```bash
firebase deploy --only storage
```

---

## 🎯 Application Features

### 1. **Authentication System**
- Email/password signup and login
- Password reset functionality
- Protected routes with authentication guards
- Persistent login sessions
- Profile completion onboarding

### 2. **Dashboard**
- Overview of active habits
- Quick stats (total habits, streaks, completion rate)
- Recent activity feed
- Quick-add habit button
- Responsive grid layout

### 3. **Habits Management**
- **Create Habits**: Name, description, icon, frequency, category
- **Edit Habits**: Update details at any time
- **Delete Habits**: Soft delete with confirmation
- **Archive Habits**: Hide completed/inactive habits
- **View Details**: Comprehensive habit analytics

### 4. **Progress Tracking**
- **Streak Counter**: Days in a row of completion
- **Completion Rate**: Percentage-based progress
- **Visual Charts**: Line graphs, bar charts, pie charts
- **Calendar Heatmap**: GitHub-style contribution calendar
- **Historical Data**: View past performance

### 5. **Goals & Milestones**
- Set daily/weekly/monthly targets
- Track goal completion
- Achievement badges
- Motivational insights
- Longest streak tracking

### 6. **Notifications & Reminders**
- **Browser Notifications**: Push reminders
- **Customizable Times**: Set multiple reminders per habit
- **Quiet Hours**: Disable notifications during sleep
- **Notification History**: View past notifications
- **Snooze Options**: Delay reminders

### 7. **Settings & Personalization**
- **Profile Picture Upload**: Custom avatars (5MB max, JPEG/PNG/GIF/WEBP)
- **Display Name**: Personalize your account
- **Theme Toggle**: Dark mode / Light mode
- **Notification Preferences**: Enable/disable by type
- **Data Export**: Download your habit data

### 8. **Offline Support**
- Service worker caching
- Offline page fallback
- Data sync when reconnected
- Background sync for pending actions
- Install prompt for app-like experience

---

## 📱 PWA Capabilities

### Installation

**Desktop (Chrome, Edge, Brave)**
1. Click the install icon in the address bar
2. Or use the "Download App" button in the sidebar
3. App installs to your applications folder

**Android**
1. Tap the menu (3 dots) in browser
2. Select "Install app" or "Add to Home Screen"
3. App appears on your home screen

**iOS (Safari)**
1. Tap the Share button
2. Scroll and tap "Add to Home Screen"
3. Name the app and tap "Add"

### Offline Features
- View previously loaded habits
- Check off habits (syncs when online)
- Browse cached pages
- Offline indicator in UI

### App Manifest
```json
{
  "name": "HabitVault",
  "short_name": "HabitVault",
  "theme_color": "#8b5cf6",
  "background_color": "#ffffff",
  "display": "standalone",
  "icons": [...]
}
```

---

## 🔥 Firebase Integration

### Authentication Flow
```
User Sign Up → Email Verification → Onboarding → Dashboard
User Login → Session Check → Redirect to Last Page
Password Reset → Email Link → Set New Password
```

### Firestore Collections
```
users/
  ├── {userId}/
  │   ├── profile
  │   ├── settings
  │   └── onboardingComplete

habits/
  ├── {habitId}/
  │   ├── name, description, icon
  │   ├── frequency, category
  │   ├── userId, createdAt
  │   └── archived, completedDates

goals/
  ├── {goalId}/
  │   ├── habitId, targetValue
  │   ├── period, progress
  │   └── userId, createdAt

reminders/
  ├── {reminderId}/
  │   ├── habitId, time
  │   ├── days, enabled
  │   └── userId

notifications/
  ├── {notificationId}/
  │   ├── userId, message
  │   ├── read, createdAt
  │   └── type, habitId
```

### Firebase Storage Structure
```
users/
  └── {userId}/
      └── profile/
          └── profile-{timestamp}.jpg  (Profile pictures)
```

### Security Rules Highlights
- Users can only access their own data
- Authenticated users required for all operations
- File upload limits (5MB for images)
- Read access for profile pictures (authenticated users)

---

## 👥 Team Contributions

This project was collaboratively built by **10 team members** as a group assignment. Below is the work division:

### 🧑‍💻 **Member 1: Project Lead & Authentication**
**Adebowale Oluwasegun** (sadebowale092@gmail.com)

**Responsibilities:**
- Project initialization and setup
- Firebase configuration and integration
- Authentication system implementation
- User registration and login pages
- Password reset functionality
- Protected routes and auth guards
- Email verification flow

**Files/Features:**
- `src/firebase/config.js`
- `src/firebase/AuthContext.jsx`
- `src/firebase/useAuthentication.js`
- `src/pages/LoginPage.jsx`
- `src/pages/SignupPage.jsx`
- `src/pages/ForgotPasswordPage.jsx`
- `src/components/auth/ProtectedRoute.jsx`
- `src/components/guards/OnboardingGuard.jsx`

---

### 👤 **Member 2: User Profile & Onboarding**

**Responsibilities:**
- User profile management system
- Onboarding flow for new users
- Profile picture upload functionality
- Display name and avatar management
- User settings page
- Firebase Storage integration for images
- Profile data persistence

**Files/Features:**
- `src/pages/OnboardingPage.jsx`
- `src/pages/dashboard/SettingsPage.jsx`
- `src/firebase/profileUtils.js`
- `src/firebase/storageServices.js`
- `src/context/UserContext.jsx`
- Profile picture upload (SettingsPage)
- Display name editor
- Avatar generation with initials

---

### 📋 **Member 3 & 9: Habits Management**

**Responsibilities:**
- Habit CRUD operations
- Habit creation and editing forms
- Habit cards and list views
- Habit detail pages
- Archive and restore functionality
- Habit categorization
- Firestore habit services

**Files/Features:**
- `src/pages/habits/HabitsPage.jsx`
- `src/pages/habits/HabitDetailPage.jsx`
- `src/components/ui/dashboard/HabitCard.jsx`
- `src/components/ui/dashboard/HabitModal.jsx`
- `src/components/ui/dashboard/HabitForm.jsx`
- `src/components/ui/dashboard/HabitViewModal.jsx`
- `src/firebase/habitServices.js`
- `src/firebase/habitUtils.js`
- `src/hooks/useHabits.jsx`
- `src/hooks/useHabit.jsx`

---

### 📊 **Member 4: Progress Tracking & Analytics**

**Responsibilities:**
- Progress tracking system
- Data visualization with Recharts
- Streak calculations
- Completion rate analytics
- Calendar heatmap
- Progress page design
- Historical data views

**Files/Features:**
- `src/pages/dashboard/progress/ProgressPage.jsx`
- `src/firebase/progressServices.js`
- `src/hooks/useProgress.js`
- `src/hooks/useHabitProgress.js`
- Chart components (Line, Bar, Pie charts)
- Streak counter logic
- Heatmap calendar
- Statistics calculations

---

### 🏆 **Member 5: Goals & Achievements**

**Responsibilities:**
- Goals and milestones system
- Achievement badges
- Streak tracking
- Goal creation and management
- Goal progress visualization
- Motivational insights
- Goals page implementation

**Files/Features:**
- `src/pages/dashboard/GoalsAndStreaksPage.jsx`
- `src/firebase/goalServices.js`
- `src/hooks/useGoals.js`
- Goal creation forms
- Achievement icon components
- Streak counters with animations
- Goal completion tracking
- Milestone badges

---

### 🔔 **Member 6 & 10: Notifications & Reminders**

**Responsibilities:**
- Notification system implementation
- Browser push notifications
- Reminder scheduling
- Notification preferences
- Reminder forms and UI
- Notification history
- Firebase Cloud Messaging setup

**Files/Features:**
- `src/pages/notifications/NotificationsPage.jsx`
- `src/components/ui/notifications/ReminderForm.jsx`
- `src/components/ui/notifications/NotificationDropdown.jsx`
- `src/services/notificationManager.js`
- `src/firebase/notificationServices.js`
- `src/firebase/reminderServices.js`
- `src/hooks/useNotifications.js`
- `src/hooks/useReminders.js`
- `src/hooks/useReminderNotifications.js`

---

### 🎨 **Member 7: UI/UX & Design System**

**Responsibilities:**
- UI component library
- Dashboard layout and sidebar
- Theme system (dark/light mode)
- Responsive design
- Animations and transitions
- Landing page design
- Tailwind CSS configuration

**Files/Features:**
- `src/components/layout/dashboard/DashboardLayout.jsx`
- `src/components/layout/MainLayout.jsx`
- `src/components/layout/RouteTransition.jsx`
- `src/components/ui/Logo.jsx`
- `src/components/ui/Button.jsx`
- `src/components/ui/dashboard/Card.jsx`
- `src/context/ThemeContext.jsx`
- `src/pages/LandingPage.jsx`
- `src/pages/dashboard/DashboardPage.jsx`
- `tailwind.config.js`
- `src/index.css`
- Framer Motion animations

---

### 📱 **Member 8: PWA & Performance**

**Responsibilities:**
- Progressive Web App setup
- Service worker configuration
- Offline functionality
- PWA install prompts
- Caching strategies
- Performance optimization
- Error handling and boundaries

**Files/Features:**
- `vite.config.js` (PWA plugin)
- `src/pwa.js`
- `public/manifest.json`
- `src/components/pwa/PWAInstallPrompt.jsx`
- `src/components/pwa/PWAStatus.jsx`
- `src/components/OfflineFallback.jsx`
- `src/components/OfflineWrapper.jsx`
- `src/context/OnlineStatusContext.jsx`
- `src/components/errors/ErrorBoundary.jsx`
- `src/components/loading/` (All loading components)
- Service worker caching
- Background sync

---

## 🔄 Development Workflow

### Git Workflow

1. **Main Branch**: Production-ready code
2. **Development Branch**: Integration branch
3. **Feature Branches**: Individual features

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Convention

```
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks
```

### Code Review Process

1. Create Pull Request with description
2. Request review from team members
3. Address feedback and comments
4. Merge after approval
5. Delete feature branch

---

## 🚀 Deployment

### Vercel Deployment

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import GitHub repository
   - Select HABITVAULT

2. **Configure Environment Variables**
   - Add all `VITE_FIREBASE_*` variables
   - Copy from `.env.local`

3. **Deploy**
   - Vercel auto-deploys on push to main
   - Preview deployments for PRs
   - Production URL: `https://habitvault.vercel.app`

### Manual Deployment

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview

# Deploy to Vercel
vercel --prod
```

### Environment Variables on Vercel

Add these in **Project Settings → Environment Variables**:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

---

## 🐛 Troubleshooting

### Common Issues

**PWA Install Button Not Showing**
- Check if running on HTTPS (required for PWA)
- Verify `manifest.json` is loaded
- Check browser console for errors
- Some browsers don't support `beforeinstallprompt`

**Firebase Authentication Errors**
- Verify environment variables are set correctly
- Check Firebase console for enabled auth methods
- Ensure domain is authorized in Firebase

**CORS Errors with Firebase Storage**
- Run the CORS setup script: `.\setup-cors.ps1`
- Or manually set CORS: `gsutil cors set cors.json gs://your-bucket`

**Offline Mode Not Working**
- Ensure service worker is registered
- Check Application tab in DevTools
- Verify PWA is installed

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for TypeScript errors: `npm run lint`

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

### Project Lead
**Adebowale Oluwasegun**  
📧 Email: sadebowale092@gmail.com  
🐙 GitHub: [@Osaseye](https://github.com/Osaseye)

### Repository
🔗 Project Link: [https://github.com/Osaseye/HABITVAULT](https://github.com/Osaseye/HABITVAULT)

### Live Application
🌐 Live Demo: [https://habitvault.vercel.app](https://habitvault.vercel.app)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [Headless UI](https://headlessui.com)
- [Vite](https://vitejs.dev)

---

<div align="center">
  
  ### ⭐ Star this repository if you found it helpful!
  
  **Made with ❤️ by the HabitVault Team**
  
  © 2025 HabitVault. All rights reserved.
  
</div>


