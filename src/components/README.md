# HabitVault UI Components

This directory contains reusable UI components for the HabitVault application, focusing on error handling and loading states.

## Component Structure

### Error Components

- **ErrorBoundary**: Class component that catches JavaScript errors in child components
- **ErrorMessage**: Component for displaying various error states with different variants
- **EmptyState**: Component for showing when no data is available
- **FormFieldError**: Component for showing form validation errors

### Loading Components

- **LoadingSpinner**: Simple spinner component with size and color variations
- **FullPageLoading**: Loading overlay that covers the entire page
- **ContentSkeleton**: Skeleton UI for text content
- **CardSkeleton**: Skeleton UI for card layouts

## Usage

### Quick Import

You can import all components from the central UI file:

```jsx
import { 
  // Error components
  ErrorBoundary, 
  ErrorMessage, 
  EmptyState, 
  FormFieldError,
  
  // Loading components
  LoadingSpinner, 
  FullPageLoading, 
  ContentSkeleton, 
  CardSkeleton 
} from '../components/ui';
```

### Error Handling Pattern

For API calls and async operations, use the `useErrorHandler` hook:

```jsx
import { useState } from 'react';
import { ErrorMessage, LoadingSpinner } from '../components/ui';
import useErrorHandler from '../hooks/useErrorHandler';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      clearError();
      const result = await api.getData();
      setData(result);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage variant={error.variant} message={error.message} onRetry={fetchData} />;
  if (!data) return <EmptyState />;

  return (
    // Render data
  );
};
```

See individual component documentation for more detailed usage examples.

## Best Practices

1. Always wrap important sections of the app with `ErrorBoundary`
2. Use the appropriate loading component based on context (full page vs. skeleton)
3. Provide retry functionality in error states when possible
4. Show empty states instead of blank pages or errors when no data is present
5. Use the utility hooks for consistent error handling

## Additional Resources

- See the `ErrorHandlingExample.jsx` and `DataFetchingExample.jsx` files for full examples
- Refer to `README.md` in the errors directory for detailed error handling documentation