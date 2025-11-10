import { ReactNode } from 'react';

/**
 * @interface AlertProps
 * @summary Props for Alert component
 */
export interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}
