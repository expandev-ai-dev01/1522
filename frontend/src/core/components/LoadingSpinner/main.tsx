import { clsx } from 'clsx';
import type { LoadingSpinnerProps } from './types';
import { getLoadingSpinnerClassName } from './variants';

/**
 * @component LoadingSpinner
 * @summary Loading spinner component for async operations
 * @domain core
 * @type ui-component
 * @category feedback
 */
export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const { size = 'medium', className } = props;

  return (
    <div className={clsx(getLoadingSpinnerClassName({ size }), className)}>
      <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
};
