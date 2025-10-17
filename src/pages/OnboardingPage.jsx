import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { saveUserProfile } from '../firebase/profileUtils';
import Logo from '../components/ui/Logo';

// Profile form fields and steps
const steps = [
  {
    title: 'Personal Information',
    description: 'Tell us a bit about yourself',
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
      { name: 'displayName', label: 'Display Name', type: 'text', placeholder: 'What should we call you?', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'A short bio about yourself', required: false },
      { name: 'birthdate', label: 'Birth Date', type: 'date', required: false },
    ]
  },
  {
    title: 'Habit Preferences',
    description: 'Let us customize your experience',
    fields: [
      { 
        name: 'goalFocus', 
        label: 'What area are you most focused on improving?', 
        type: 'select', 
        options: [
          { value: 'health', label: 'Health & Fitness' },
          { value: 'productivity', label: 'Productivity' },
          { value: 'learning', label: 'Learning & Education' },
          { value: 'finance', label: 'Finance & Money' },
          { value: 'mindfulness', label: 'Mindfulness & Mental Health' },
          { value: 'social', label: 'Social & Relationships' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      { 
        name: 'dailyReminder', 
        label: 'Do you want daily habit reminders?', 
        type: 'radio', 
        options: [
          { value: true, label: 'Yes, remind me daily' },
          { value: false, label: 'No, I\'ll check on my own' }
        ],
        required: true
      },
      { 
        name: 'reminderTime', 
        label: 'What time would you like to be reminded?', 
        type: 'time', 
        required: false,
        dependsOn: { field: 'dailyReminder', value: true }
      },
    ]
  },
  {
    title: 'Personalization',
    description: 'Make HabitVault your own',
    fields: [
      { 
        name: 'preferredTheme', 
        label: 'Preferred Theme', 
        type: 'radio', 
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System Default' }
        ],
        required: true
      },
      { 
        name: 'weekStartsOn', 
        label: 'When does your week start?', 
        type: 'select', 
        options: [
          { value: '0', label: 'Sunday' },
          { value: '1', label: 'Monday' }
        ],
        required: true
      },
      { 
        name: 'profilePicture', 
        label: 'Profile Picture', 
        type: 'file',
        accept: 'image/*',
        required: false
      },
    ]
  }
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    bio: '',
    birthdate: '',
    goalFocus: 'health',
    dailyReminder: true,
    reminderTime: '08:00',
    preferredTheme: 'system',
    weekStartsOn: '1',
    profilePicture: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Handle file uploads
    if (type === 'file' && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      return;
    }

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }));
      return;
    }
    
    // Handle radio buttons and other inputs
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Next step button handler
  const handleNext = () => {
    // Validate current step fields
    const currentFields = steps[currentStep].fields;
    const requiredFields = currentFields.filter(field => field.required);
    
    // Check if any required fields are empty
    const hasEmptyRequiredFields = requiredFields.some(field => {
      if (field.dependsOn) {
        // Only validate dependent fields if the condition is met
        return formData[field.dependsOn.field] === field.dependsOn.value && 
               (!formData[field.name] || formData[field.name] === '');
      }
      return !formData[field.name] || formData[field.name] === '';
    });
    
    if (hasEmptyRequiredFields) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // If we're on the last step, submit the form
    if (currentStep === steps.length - 1) {
      handleSubmit();
    } else {
      // Otherwise, go to the next step
      setCurrentStep(prev => prev + 1);
    }
  };

  // Back button handler
  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setError('');
  };

  // Form submission handler
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      if (!currentUser) {
        throw new Error('You must be logged in to complete onboarding');
      }
      
      // Prepare the profile data (exclude profilePicture for now)
      const { profilePicture, ...profileData } = formData;
      
      // Save the user profile data
      await saveUserProfile(currentUser.uid, profileData);
      
      // TODO: Handle profile picture upload separately if needed
      
      // Navigate to the dashboard after successful onboarding
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during onboarding:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form fields based on the current step
  const renderFields = () => {
    const currentFields = steps[currentStep].fields;
    
    return currentFields.map(field => {
      // Check if this field should be shown (based on dependencies)
      if (field.dependsOn && formData[field.dependsOn.field] !== field.dependsOn.value) {
        return null;
      }
      
      switch (field.type) {
        case 'text':
        case 'date':
        case 'time':
        case 'email':
        case 'password':
          return (
            <div className="mb-4" key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white"
                required={field.required}
              />
            </div>
          );
          
        case 'textarea':
          return (
            <div className="mb-4" key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white"
                required={field.required}
              />
            </div>
          );
          
        case 'select':
          return (
            <div className="mb-4" key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white"
                required={field.required}
              >
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
          
        case 'radio':
          return (
            <div className="mb-4" key={field.name}>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </span>
              <div className="space-y-2">
                {field.options.map(option => (
                  <div className="flex items-center" key={`${field.name}-${option.value}`}>
                    <input
                      type="radio"
                      id={`${field.name}-${option.value}`}
                      name={field.name}
                      value={option.value}
                      checked={formData[field.name]?.toString() === option.value?.toString()}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent focus:ring-accent border-gray-300 dark:border-gray-600"
                      required={field.required}
                    />
                    <label htmlFor={`${field.name}-${option.value}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'file':
          return (
            <div className="mb-4" key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                id={field.name}
                name={field.name}
                onChange={handleChange}
                accept={field.accept || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white"
                required={field.required}
              />
            </div>
          );
          
        default:
          return null;
      }
    });
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                currentStep === index ? 'bg-accent text-white' : 
                currentStep > index ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } text-sm font-medium`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-10 h-1 ${
                currentStep > index ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white font-poppins">
          Welcome to HabitVault!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Let's set up your profile to get started.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Step indicators */}
          {renderStepIndicators()}

          {/* Step title and description */}
          <div className="mb-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {renderFields()}

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                  'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Complete Setup'}
                {isSubmitting && ' ...'}
              </button>
            </div>
          </form>

          {/* Skip for now */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-accent hover:text-accent-dark dark:text-accent-light dark:hover:text-accent"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;