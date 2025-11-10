import { ReactNode } from 'react';

/**
 * @interface ErrorBoundaryProps
 * @summary Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * @interface ErrorBoundaryState
 * @summary State for ErrorBoundary component
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
