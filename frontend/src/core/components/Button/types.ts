import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @interface ButtonProps
 * @summary Props for Button component
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}
