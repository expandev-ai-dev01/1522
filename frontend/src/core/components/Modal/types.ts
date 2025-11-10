import { ReactNode } from 'react';

/**
 * @interface ModalProps
 * @summary Props for Modal component
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
