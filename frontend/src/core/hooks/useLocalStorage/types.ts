/**
 * @type UseLocalStorageReturn
 * @summary Return type for useLocalStorage hook
 */
export type UseLocalStorageReturn<T> = [T, (value: T | ((val: T) => T)) => void, () => void];
