'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error reporting service (e.g., Sentry)
      // console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--navy-deep)] flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Something went wrong</h2>
        <p className="text-[var(--text-muted)] mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--navy-deep)] rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-[var(--surface-2)] text-[var(--text)] rounded-lg font-medium hover:bg-[var(--surface-hover)] transition-colors border border-[var(--border)]"
          >
            Try Again
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="text-[var(--text-muted)] cursor-pointer text-sm">Error details</summary>
            <pre className="mt-2 text-xs text-[var(--text-muted)] overflow-auto bg-[var(--navy-deep)] p-4 rounded">
              {error.toString()}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}


