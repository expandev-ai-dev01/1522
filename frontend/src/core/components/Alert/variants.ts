import { clsx } from 'clsx';

export interface AlertVariantProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Get alert className based on variants
 */
export function getAlertClassName(props: AlertVariantProps): string {
  const { variant = 'info' } = props;

  return clsx('p-4 rounded-md border', {
    'bg-blue-50 border-blue-200 text-blue-800': variant === 'info',
    'bg-green-50 border-green-200 text-green-800': variant === 'success',
    'bg-yellow-50 border-yellow-200 text-yellow-800': variant === 'warning',
    'bg-red-50 border-red-200 text-red-800': variant === 'error',
  });
}
