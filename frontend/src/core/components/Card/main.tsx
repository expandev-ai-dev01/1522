import { clsx } from 'clsx';
import type { CardProps } from './types';
import { getCardClassName } from './variants';

/**
 * @component Card
 * @summary Reusable card container component
 * @domain core
 * @type ui-component
 * @category layout
 */
export const Card = (props: CardProps) => {
  const { children, variant = 'default', padding = 'md', className, ...rest } = props;

  return (
    <div className={clsx(getCardClassName({ variant, padding }), className)} {...rest}>
      {children}
    </div>
  );
};
