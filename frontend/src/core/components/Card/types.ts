import { HTMLAttributes, ReactNode } from 'react';

/**
 * @interface CardProps
 * @summary Props for Card component
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
