import { InputHTMLAttributes } from 'react';

/**
 * @interface InputProps
 * @summary Props for Input component
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
