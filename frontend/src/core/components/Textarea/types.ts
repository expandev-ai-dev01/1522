import { TextareaHTMLAttributes } from 'react';

/**
 * @interface TextareaProps
 * @summary Props for Textarea component
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
