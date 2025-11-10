import { clsx } from 'clsx';

export interface LoadingSpinnerVariantProps {
  size?: 'small' | 'medium' | 'large';
}

/**
 * Get loading spinner className based on variants
 */
export function getLoadingSpinnerClassName(props: LoadingSpinnerVariantProps): string {
  const { size = 'medium' } = props;

  return clsx('flex items-center justify-center', {
    'w-4 h-4': size === 'small',
    'w-8 h-8': size === 'medium',
    'w-12 h-12': size === 'large',
  });
}
