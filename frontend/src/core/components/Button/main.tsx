import { clsx } from 'clsx';
import type { ButtonProps } from './types';
import { getButtonClassName } from './variants';

/**
 * @component Button
 * @summary Reusable button component with variants
 * @domain core
 * @type ui-component
 * @category form
 */
export const Button = (props: ButtonProps) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    type = 'button',
    onClick,
    className,
    ...rest
  } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(getButtonClassName({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {children}
    </button>
  );
};
