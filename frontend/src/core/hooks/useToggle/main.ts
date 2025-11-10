import { useState, useCallback } from 'react';
import type { UseToggleReturn } from './types';

/**
 * @hook useToggle
 * @summary Manages boolean toggle state
 * @domain core
 * @type utility-hook
 * @category state
 */
export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}
