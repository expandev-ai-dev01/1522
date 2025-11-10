import { clsx } from 'clsx';

export interface TextareaVariantProps {
  error?: boolean;
}

/**
 * Get textarea className based on variants
 */
export function getTextareaClassName(props: TextareaVariantProps): string {
  const { error = false } = props;

  return clsx(
    'w-full px-4 py-2 border rounded-md transition-colors',
    'focus:ring-2 focus:ring-offset-0 focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
    'resize-vertical',
    {
      'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !error,
      'border-red-500 focus:border-red-500 focus:ring-red-500': error,
    }
  );
}
