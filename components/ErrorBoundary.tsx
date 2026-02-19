import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-6 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-3">
            <AlertTriangle size={20} />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200">Something went wrong</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
            {this.state.error?.message || 'Failed to render component'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
