import { useState, useEffect } from 'react';
import type { UseDebounceOptions } from './types';

/**
 * @hook useDebounce
 * @summary Debounces a value with configurable delay
 * @domain core
 * @type utility-hook
 * @category performance
 */
export function useDebounce<T>(value: T, options: UseDebounceOptions = {}): T {
  const { delay = 500 } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
