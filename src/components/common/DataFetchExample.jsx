import React, { useState, useEffect } from 'react';
import { ErrorMessage, EmptyState } from '../components/errors';
import { LoadingSpinner, ContentSkeleton } from '../components/loading/LoadingSpinner'; // Assuming you have this from previous conversation
import useErrorHandler from '../hooks/useErrorHandler';

/**
 * Component that demonstrates a complete data fetching flow
 * with loading, error and empty states
 */
const DataFetchExample = ({ 
  fetchDataFn,  // Function to fetch data
  renderItem,   // Render function for each item
  emptyTitle = 'No items found',
  emptyMessage = 'There are no items to display.',
  emptyActionText = 'Create New',
  emptyAction = null,
  loadingType = 'spinner', // 'spinner' or 'skeleton'
  skeletonLines = 5,
  listClassName = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const { error, handleError, clearError } = useErrorHandler();

  const loadData = async () => {
    try {
      setIsLoading(true);
      clearError();
      const data = await fetchDataFn();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (isLoading) {
    return loadingType === 'skeleton' ? (
      <ContentSkeleton lines={skeletonLines} />
    ) : (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        variant={error.variant}
        message={error.message}
        onRetry={loadData}
        error={error.originalError}
      />
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        onAction={emptyAction}
        actionText={emptyActionText}
      />
    );
  }

  // Data loaded successfully
  return (
    <div className={listClassName}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};

export default DataFetchExample;