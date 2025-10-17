import React, { useState } from 'react';
import { ErrorBoundary, ErrorMessage, EmptyState, FormFieldError } from '../components/errors';
import useErrorHandler from '../hooks/useErrorHandler';
import { LoadingSpinner } from '../components/loading/LoadingSpinner'; // Assuming you have this from previous conversation

const ExampleComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const [hasData, setHasData] = useState(false);
  const [formError, setFormError] = useState('');

  // Simulate successful data fetch
  const fetchData = () => {
    setIsLoading(true);
    clearError();
    
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setHasData(true);
    }, 1500);
  };

  // Simulate network error
  const simulateNetworkError = () => {
    setIsLoading(true);
    clearError();
    
    // Simulating API error
    setTimeout(() => {
      setIsLoading(false);
      handleError({ 
        name: 'NetworkError', 
        message: 'Failed to fetch data from server' 
      });
    }, 1500);
  };

  // Simulate 404 error
  const simulateNotFoundError = () => {
    setIsLoading(true);
    clearError();
    
    // Simulating API error
    setTimeout(() => {
      setIsLoading(false);
      handleError({ 
        response: { 
          status: 404,
          data: { message: 'Resource not found' } 
        } 
      });
    }, 1500);
  };

  // Simulate authentication error
  const simulateAuthError = () => {
    setIsLoading(true);
    clearError();
    
    // Simulating API error
    setTimeout(() => {
      setIsLoading(false);
      handleError({ 
        response: { 
          status: 401,
          data: { message: 'Your session has expired' } 
        } 
      });
    }, 1500);
  };

  // Simulate form validation error
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    if (!email) {
      setFormError('Email is required');
    } else if (!email.includes('@')) {
      setFormError('Please enter a valid email address');
    } else {
      setFormError('');
      alert('Form submitted successfully!');
    }
  };

  // Simulate component crash
  const crashComponent = () => {
    throw new Error('This is a simulated component crash');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        variant={error.variant}
        title={`${error.variant.charAt(0).toUpperCase() + error.variant.slice(1)} Error`}
        message={error.message}
        onRetry={clearError}
        error={error.originalError}
      />
    );
  }

  if (!hasData) {
    return (
      <EmptyState
        title="No habits found"
        message="You haven't created any habits yet."
        onAction={fetchData}
        actionText="Create Your First Habit"
      />
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Error Handling Examples
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={simulateNetworkError}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Simulate Network Error
        </button>
        
        <button
          onClick={simulateNotFoundError}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
        >
          Simulate 404 Error
        </button>
        
        <button
          onClick={simulateAuthError}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
        >
          Simulate Auth Error
        </button>
        
        <button
          onClick={crashComponent}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
        >
          Crash Component
        </button>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Form Error Example
        </h3>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            />
            <FormFieldError message={formError} />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md"
          >
            Submit Form
          </button>
        </form>
      </div>
      
      <div className="text-right">
        <button
          onClick={() => setHasData(false)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
        >
          Show Empty State
        </button>
      </div>
    </div>
  );
};

// Wrap the example component with ErrorBoundary
const ErrorHandlingExample = () => (
  <ErrorBoundary>
    <ExampleComponent />
  </ErrorBoundary>
);

export default ErrorHandlingExample;