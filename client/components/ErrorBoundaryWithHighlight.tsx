import React, { Component, ReactNode } from 'react';
import { trackNASError, debugLog } from '@/lib/highlight';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bug, MessageCircle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  resetOnPropsChange?: boolean;
  level?: 'page' | 'component' | 'widget';
  context?: string;
}

class NASErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: `nas_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    const { onError, context = 'unknown', level = 'component' } = this.props;
    
    // Track error with Highlight.io
    trackNASError(`${level}-error`, error, {
      context,
      level,
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Debug logging
    debugLog('Error Boundary Caught Error', {
      error: error.message,
      stack: error.stack,
      context,
      level,
      componentStack: errorInfo.componentStack
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
      errorId: `nas_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  }

  handleReset = () => {
    debugLog('Error Boundary Reset', { context: this.props.context });
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportBug = () => {
    const { error, errorId } = this.state;
    debugLog('Bug Report Initiated', { errorId, error: error?.message });
    
    // In a real app, this would open a bug report form
    // For now, we'll just copy error details to clipboard
    const errorDetails = `
Error ID: ${errorId}
Error: ${error?.message}
Context: ${this.props.context}
Level: ${this.props.level}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
Stack: ${error?.stack}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      alert('Error details copied to clipboard. Please share with support.');
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback, level = 'component', context = 'unknown' } = this.props;
      const { error, errorId } = this.state;

      if (fallback) {
        return fallback;
      }

      // Different error UIs based on level
      if (level === 'page') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-md w-full mx-4">
              <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-purple-600 mb-4">🔧</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Neural Architecture Search Error
                </h2>
                <p className="text-gray-600">
                  Built by Shaurya Upadhyay - Something went wrong with the page
                </p>
              </div>

              <Alert className="mb-6 border-red-200 bg-red-50">
                <Bug className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Application Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  <strong>Error ID:</strong> {errorId}<br />
                  <strong>Context:</strong> {context}<br />
                  <strong>Message:</strong> {error?.message || 'Unknown error occurred'}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button onClick={this.handleReset} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleReportBug} variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Report Bug
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  variant="ghost" 
                  className="w-full"
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        );
      }

      if (level === 'widget') {
        return (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-start space-x-3">
              <Bug className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800">Widget Error</p>
                <p className="text-sm text-red-600 mt-1">
                  {error?.message || 'This component failed to load'}
                </p>
                <div className="mt-2 space-x-2">
                  <Button onClick={this.handleReset} size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Default component level error
      return (
        <Alert className="border-amber-200 bg-amber-50">
          <Bug className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Component Error</AlertTitle>
          <AlertDescription className="text-amber-700">
            <div className="space-y-2">
              <p><strong>Error:</strong> {error?.message || 'Unknown error'}</p>
              <p><strong>Context:</strong> {context}</p>
              <div className="flex space-x-2 mt-3">
                <Button onClick={this.handleReset} size="sm" variant="outline">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button onClick={this.handleReportBug} size="sm" variant="ghost">
                  Report
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// HOC for easy wrapping of components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <NASErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </NASErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Main Error Boundary component with Highlight.io integration
export function ErrorBoundaryWithHighlight({ children, ...props }: ErrorBoundaryProps) {
  return (
    <HighlightErrorBoundary>
      <NASErrorBoundary {...props}>
        {children}
      </NASErrorBoundary>
    </HighlightErrorBoundary>
  );
}

// Specialized error boundaries for different parts of the app
export const PageErrorBoundary = ({ children, context }: { children: ReactNode; context?: string }) => (
  <ErrorBoundaryWithHighlight level="page" context={context || 'page'}>
    {children}
  </ErrorBoundaryWithHighlight>
);

export const ComponentErrorBoundary = ({ children, context }: { children: ReactNode; context?: string }) => (
  <ErrorBoundaryWithHighlight level="component" context={context || 'component'}>
    {children}
  </ErrorBoundaryWithHighlight>
);

export const WidgetErrorBoundary = ({ children, context }: { children: ReactNode; context?: string }) => (
  <ErrorBoundaryWithHighlight level="widget" context={context || 'widget'}>
    {children}
  </ErrorBoundaryWithHighlight>
);

export default ErrorBoundaryWithHighlight;
