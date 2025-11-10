import { clsx } from 'clsx';
import type { AlertProps } from './types';
import { getAlertClassName } from './variants';

/**
 * @component Alert
 * @summary Alert notification component
 * @domain core
 * @type ui-component
 * @category feedback
 */
export const Alert = (props: AlertProps) => {
  const { children, variant = 'info', onClose, className } = props;

  return (
    <div className={clsx(getAlertClassName({ variant }), className)} role="alert">
      <div className="flex items-start">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close alert"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
