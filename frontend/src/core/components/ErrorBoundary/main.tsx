import React, { Component, ReactNode, ErrorInfo } from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';

/**
 * @component ErrorBoundary
 * @summary Error boundary for graceful error handling
 * @domain core
 * @type utility-component
 * @category error-handling
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Algo deu errado</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
