# Error Handling Components

This document explains how to effectively use the error handling components provided in the HabitVault application.

## Overview

The error handling system consists of:

1. **ErrorBoundary** - A React class component that catches JavaScript errors in child components
2. **ErrorMessage** - A reusable component for displaying various error states
3. **EmptyState** - A component for when no data is available
4. **FormFieldError** - A component for displaying form validation errors
5. **useErrorHandler** - A custom hook for managing API errors

## Components Usage

### ErrorBoundary

Use this component to catch and handle unhandled errors in your component tree. It will prevent the entire app from crashing when an error occurs in a component.

```jsx
import { ErrorBoundary } from '../components/errors';

const App = () => (
  <ErrorBoundary>
    {/* Your application components */}
    <YourComponent />
  </ErrorBoundary>
);
```

Best practices:
- Place ErrorBoundary at strategic points in your component tree (not just at the root)
- Consider wrapping important/complex components individually
- Use multiple ErrorBoundaries to isolate failures to specific sections

### ErrorMessage

Use this component to display user-friendly error messages with various presets.

```jsx
import { ErrorMessage } from '../components/errors';

// Basic usage
<ErrorMessage 
  title="Failed to load habits" 
  message="Could not retrieve your habits. Please try again later." 
  onRetry={fetchHabits} 
/>

// With predefined variants: 'default', 'network', 'auth', 'notFound'
<ErrorMessage 
  variant="network" 
  onRetry={fetchHabits} 
/>

// With error object (only displayed in development mode)
<ErrorMessage 
  variant="default" 
  error={errorObject} 
/>
```

### EmptyState

Use this component when there's no data to display.

```jsx
import { EmptyState } from '../components/errors';

<EmptyState
  title="No habits found"
  message="You haven't created any habits yet."
  onAction={createNewHabit}
  actionText="Create Your First Habit"
/>
```

### FormFieldError

Use this component to display validation errors under form fields.

```jsx
import { FormFieldError } from '../components/errors';

<div>
  <label htmlFor="email">Email</label>
  <input 
    type="email" 
    id="email" 
    value={email} 
    onChange={handleChange} 
  />
  <FormFieldError message={emailError} />
</div>
```

## Custom Hook Usage

### useErrorHandler

This hook provides utilities for handling API errors consistently.

```jsx
import useErrorHandler from '../hooks/useErrorHandler';

const MyComponent = () => {
  const { error, handleError, clearError, withErrorHandling } = useErrorHandler();
  
  // Manual error handling
  const fetchData = async () => {
    try {
      clearError();
      const response = await api.getData();
      setData(response.data);
    } catch (err) {
      handleError(err);
    }
  };
  
  // Automatic error handling with wrapper
  const fetchDataWithErrorHandling = withErrorHandling(async () => {
    const response = await api.getData();
    setData(response.data);
  });
  
  // Rendering error state
  if (error) {
    return (
      <ErrorMessage
        variant={error.variant}
        message={error.message}
        onRetry={clearError}
        error={error.originalError}
      />
    );
  }
  
  return (
    // Your component UI
  );
};
```

## Best Practices

1. **Handle API errors consistently** - Use the `useErrorHandler` hook for all API calls
2. **Use specific error variants** - Choose the appropriate variant based on the error type
3. **Always provide retry functionality** - Give users a way to recover from errors
4. **Gracefully handle empty states** - Use EmptyState instead of showing a blank screen
5. **Validate forms properly** - Use FormFieldError components for field-level validation
6. **Wrap important components** - Use ErrorBoundary around key sections of your app
7. **Log errors for debugging** - Ensure errors are properly logged for troubleshooting

## Integration with Loading States

Pair error components with loading components for a complete user experience:

```jsx
const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const [data, setData] = useState([]);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      clearError();
      const response = await api.getData();
      setData(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (error) {
    return (
      <ErrorMessage
        variant={error.variant}
        message={error.message}
        onRetry={fetchData}
        error={error.originalError}
      />
    );
  }
  
  if (data.length === 0) {
    return (
      <EmptyState
        title="No items found"
        message="You don't have any items yet."
        onAction={createItem}
        actionText="Create New Item"
      />
    );
  }
  
  return (
    // Render your data
  );
};
```