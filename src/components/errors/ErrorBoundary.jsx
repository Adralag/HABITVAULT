import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Optionally log to a service like Firebase Analytics, Sentry, etc.
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-lg w-full">
            <div className="w-16 h-16 mx-auto text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              We're sorry, but an unexpected error occurred. Our team has been notified and is working on a fix.
            </p>
            
            <div className="mt-6">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Reload page
              </button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-md text-left">
                <p className="text-red-700 dark:text-red-300 text-sm font-medium mb-2">
                  Development Error Details:
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mb-2 font-mono">
                  {this.state.error.toString()}
                </p>
                <details className="text-red-600 dark:text-red-400 text-xs font-mono">
                  <summary>Stack trace</summary>
                  <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-64">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;