import { clsx } from 'clsx';
import type { TextareaProps } from './types';
import { getTextareaClassName } from './variants';

/**
 * @component Textarea
 * @summary Reusable textarea component with label and error handling
 * @domain core
 * @type ui-component
 * @category form
 */
export const Textarea = (props: TextareaProps) => {
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

  const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        disabled={disabled}
        className={clsx(getTextareaClassName({ error: !!error }), className)}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};
