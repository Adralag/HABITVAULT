import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/dashboard/DashboardLayout';
import Card from '../../components/ui/dashboard/Card';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../firebase/AuthContext';
import { uploadAndUpdateProfilePicture, getProfilePictureURL, updateUserProfile } from '../../firebase/storageServices';
import { LoadingSpinner, CardSkeleton, ErrorMessage } from '../../components/ui';

// Toggle Switch Component
const ToggleSwitch = ({ label, enabled, onChange, description }) => {
  return (
    <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="pr-4">
        <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{label}</h4>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`${
          enabled ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex h-5 sm:h-6 w-9 sm:w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2`}
        role="switch"
        aria-checked={enabled}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-4 sm:h-5 w-4 sm:w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

// Radio Option Component
const RadioOption = ({ label, value, name, selectedValue, onChange, description }) => {
  return (
    <div className="flex items-center py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="min-w-0 flex-1 pr-3">
        <label htmlFor={`${name}-${value}`} className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">{description}</p>
        )}
      </div>
      <div className="ml-2 sm:ml-3 flex h-5 items-center">
        <input
          id={`${name}-${value}`}
          name={name}
          type="radio"
          value={value}
          checked={selectedValue === value}
          onChange={() => onChange(value)}
          className="h-4 w-4 border-gray-300 dark:border-gray-600 text-accent focus:ring-accent"
        />
      </div>
    </div>
  );
};

// Select Option Component
const SelectOption = ({ label, options, value, onChange, description }) => {
  return (
    <div className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <label htmlFor={label} className="block text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">
        {label}
      </label>
      {description && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">{description}</p>
      )}
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 shadow-sm focus:border-accent focus:ring-accent text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const {
    settings: userSettings,
    loading,
    error,
    clearError,
    updateAppearance,
    updateSecurity,
    updateNotifications,
    updateRegional,
    resetAllSettings,
    regenerateEncryptionKey
  } = useSettings();

  // Local state for showing/hiding encryption key
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayNameValue, setDisplayNameValue] = useState('');
  const [localSettings, setLocalSettings] = useState({
    notifications: {
      enabled: true,
      emailNotifications: false,
      reminders: true,
    },
    security: {
      dataExport: 'encrypted',
      encryptionKey: '',
    },
    regional: {
      language: 'en',
      timezone: 'UTC',
      weekStart: 'monday',
    }
  });

  // Load settings from Firebase into local state
  useEffect(() => {
    if (userSettings) {
      setLocalSettings({
        notifications: { ...userSettings.notifications },
        security: { ...userSettings.security },
        regional: { ...userSettings.regional }
      });
    }
  }, [userSettings]);

  // Initialize display name from current user
  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayNameValue(currentUser.displayName);
    }
  }, [currentUser]);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      await uploadAndUpdateProfilePicture(currentUser, file);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Force re-render by reloading user
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(error.message || 'Failed to upload profile picture');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle display name update
  const handleUpdateDisplayName = async () => {
    if (!displayNameValue.trim()) {
      alert('Display name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile(currentUser, null, displayNameValue);
      setEditingDisplayName(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Force re-render by reloading user
      window.location.reload();
    } catch (error) {
      console.error('Error updating display name:', error);
      alert('Failed to update display name');
    } finally {
      setIsSaving(false);
    }
  };

  // Update a specific setting section
  const updateSettingSection = (section, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Handle save button for all settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Update each section separately
      await Promise.all([
        updateNotifications(localSettings.notifications),
        updateSecurity(localSettings.security),
        updateRegional(localSettings.regional)
      ]);
      
      setSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle regenerating encryption key
  const handleRegenerateKey = async () => {
    if (confirm('Are you sure you want to generate a new encryption key? This may affect your data.')) {
      try {
        const newKey = await regenerateEncryptionKey();
        setLocalSettings(prev => ({
          ...prev,
          security: {
            ...prev.security,
            encryptionKey: newKey
          }
        }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error('Error regenerating key:', err);
      }
    }
  };

  // Handle reset all settings
  const handleResetAllSettings = async () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      try {
        const defaultSettings = await resetAllSettings();
        setLocalSettings({
          notifications: { ...defaultSettings.notifications },
          security: { ...defaultSettings.security },
          regional: { ...defaultSettings.regional }
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error('Error resetting settings:', err);
      }
    }
  };

  // Render loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-poppins">Settings</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Manage your account preferences and application settings
            </p>
          </div>
          
          <CardSkeleton height="100px" />
          <CardSkeleton height="300px" />
          <CardSkeleton height="200px" />
          <CardSkeleton height="200px" />
          <CardSkeleton height="200px" />
        </div>
      </DashboardLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">Error loading settings: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>

          {/* Success message */}
          {saveSuccess && (
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm">
              Settings saved successfully!
            </div>
          )}
        </div>

        {/* Appearance Section */}
        <Card title="Appearance" subtitle="Customize how HabitVault looks">
          <div className="space-y-1">
            <ToggleSwitch 
              label="Dark Mode" 
              enabled={theme === 'dark'} 
              onChange={toggleTheme}
              description="Switch between light and dark themes"
            />
          </div>
        </Card>

        {/* Profile Section */}
        <Card title="Profile" subtitle="Manage your profile information">
          <div className="space-y-4">
            {/* Profile Picture */}
            <div className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-3">Profile Picture</h4>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={getProfilePictureURL(currentUser?.photoURL, currentUser?.displayName || currentUser?.email)}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                  {uploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <LoadingSpinner size="sm" color="white" />
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="profile-picture-upload" className="cursor-pointer">
                    <span className="px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-medium inline-block">
                      {currentUser?.photoURL ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    JPG, PNG, GIF or WEBP. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="py-3 sm:py-4">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2">Display Name</h4>
              {editingDisplayName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={displayNameValue}
                    onChange={(e) => setDisplayNameValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="Enter your display name"
                  />
                  <button
                    onClick={handleUpdateDisplayName}
                    disabled={isSaving}
                    className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-medium disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingDisplayName(false);
                      setDisplayNameValue(currentUser?.displayName || '');
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentUser?.displayName || 'Not set'}
                  </p>
                  <button
                    onClick={() => setEditingDisplayName(true)}
                    className="text-sm text-accent hover:text-accent/80 font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Security & Privacy Section */}
        <Card title="Security & Privacy" subtitle="Manage your security preferences and encryption settings">
          <div className="space-y-1">
            <div className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <label htmlFor="encryption-key" className="block text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">
                Encryption Key
              </label>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                This key is used to encrypt and decrypt your habit data. Never share this key with anyone.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
                <input
                  type={showEncryptionKey ? 'text' : 'password'}
                  value={localSettings?.security?.encryptionKey || ''}
                  onChange={(e) => updateSettingSection('security', 'encryptionKey', e.target.value)}
                  id="encryption-key"
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 shadow-sm focus:border-accent focus:ring-accent text-sm"
                />
                <div className="flex">
                  <button
                    type="button"
                    className="sm:ml-3 px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                  >
                    {showEncryptionKey ? 'Hide' : 'Show'}
                  </button>
                  <button
                    type="button"
                    className="ml-2 px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={handleRegenerateKey}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
                Warning: If you lose this key, your data cannot be recovered.
              </p>
            </div>

            <RadioOption
              label="Data Export Format"
              name="dataExport"
              value="encrypted"
              selectedValue={localSettings?.security?.dataExport || 'encrypted'}
              onChange={(value) => updateSettingSection('security', 'dataExport', value)}
              description="Export data with encryption (recommended for security)"
            />
            <RadioOption
              label="Plain Text Export"
              name="dataExport"
              value="plaintext"
              selectedValue={localSettings?.security?.dataExport || 'encrypted'}
              onChange={(value) => updateSettingSection('security', 'dataExport', value)}
              description="Export data without encryption (less secure, but readable)"
            />

            <div className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <div>
                <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Reset All Settings</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                  This will reset all settings to their defaults
                </p>
              </div>
              <button
                type="button"
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-red-300 dark:border-red-700 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/10 w-full sm:w-auto"
                onClick={handleResetAllSettings}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card title="Notifications" subtitle="Configure how you want to be notified">
          <div className="space-y-1">
            <ToggleSwitch 
              label="Enable Notifications" 
              enabled={localSettings?.notifications?.enabled || false} 
              onChange={() => updateSettingSection('notifications', 'enabled', !localSettings?.notifications?.enabled)}
              description="Receive in-app reminders about your habits"
            />

            <ToggleSwitch 
              label="Email Notifications" 
              enabled={localSettings?.notifications?.emailNotifications || false} 
              onChange={() => updateSettingSection('notifications', 'emailNotifications', !localSettings?.notifications?.emailNotifications)}
              description="Receive email reminders (requires verified email)"
            />

            <ToggleSwitch 
              label="Daily Reminders" 
              enabled={localSettings?.notifications?.reminders || false} 
              onChange={() => updateSettingSection('notifications', 'reminders', !localSettings?.notifications?.reminders)}
              description="Get daily summaries of your pending habits"
            />
          </div>
        </Card>

        {/* Preferences Section */}
        <Card title="Regional & Time Preferences" subtitle="Configure language and timezone settings">
          <div className="space-y-1">
            <SelectOption
              label="Language"
              value={localSettings?.regional?.language || 'en'}
              onChange={(value) => updateSettingSection('regional', 'language', value)}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'German', value: 'de' },
                { label: 'Japanese', value: 'ja' },
              ]}
              description="Select your preferred language for the app interface"
            />

            <SelectOption
              label="Timezone"
              value={localSettings?.regional?.timezone || 'UTC'}
              onChange={(value) => updateSettingSection('regional', 'timezone', value)}
              options={[
                { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
                { label: 'EST (Eastern Standard Time)', value: 'America/New_York' },
                { label: 'PST (Pacific Standard Time)', value: 'America/Los_Angeles' },
                { label: 'GMT (Greenwich Mean Time)', value: 'Europe/London' },
                { label: 'IST (Indian Standard Time)', value: 'Asia/Kolkata' },
              ]}
              description="Select your timezone for accurate habit tracking"
            />

            <SelectOption
              label="First Day of Week"
              value={localSettings?.regional?.weekStart || 'monday'}
              onChange={(value) => updateSettingSection('regional', 'weekStart', value)}
              options={[
                { label: 'Sunday', value: 'sunday' },
                { label: 'Monday', value: 'monday' },
                { label: 'Saturday', value: 'saturday' },
              ]}
              description="Choose which day your week starts on for analytics"
            />
          </div>
        </Card>

        {/* Account Section */}
        <Card title="Account" subtitle="Manage your account information">
          <div className="space-y-3 sm:space-y-4">
            <div className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Email Address</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentUser?.email || 'Not available'}</p>
              <button
                type="button"
                className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-accent hover:text-accent/80 font-medium"
              >
                Change email
              </button>
            </div>

            <div className="py-3 sm:py-4">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Password</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentUser?.metadata?.lastSignInTime ? 
                  `Last sign in: ${new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()}` : 
                  'Not available'}
              </p>
              <button
                type="button"
                className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-accent hover:text-accent/80 font-medium"
              >
                Change password
              </button>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-red-300 dark:border-red-700 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                Delete Account
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This will permanently delete your account and all your data
              </p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center sm:justify-end">
          <button
            type="button"
            className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;