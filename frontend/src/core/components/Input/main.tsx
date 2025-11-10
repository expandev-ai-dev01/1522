import { clsx } from 'clsx';
import type { InputProps } from './types';
import { getInputClassName } from './variants';

/**
 * @component Input
 * @summary Reusable input component with label and error handling
 * @domain core
 * @type ui-component
 * @category form
 */
export const Input = (props: InputProps) => {
  const {
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    className,
    id,
    ...rest
  } = props;

  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        disabled={disabled}
        className={clsx(getInputClassName({ error: !!error }), className)}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};
