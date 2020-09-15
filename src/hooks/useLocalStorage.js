import { useEffect, useState } from "react";

import log from "loglevel";

/* useLocalStorage
 *
 * Original code from:
 * <https://usehooks.com/useLocalStorage/>
 *
 * Modified to work with next.js with information from
 * <https://joshwcomeau.com/react/the-perils-of-rehydration/
 */
export const useLocalStorage = (key, initialValue) => {
  // Determine whether this is mounted on a DOM or not
  // If not, this code is running at static generation time --
  // not in a browser.
  const [hasMounted, setHasMounted] = useState(false);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    // Check whether we are running in a browser or not
    // Why not use the hasMounted stuff below for this?
    // That stuff didn't do what I expected inside this function.
    const isClient = typeof window === "object";
    if (!isClient) return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      log.error(
        `useLocalStorage(${key}, ${initialValue}): will return initialValue because encountered error: ${error}`
      );
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      log.error(
        `useLocalStorage(${key}, ${initialValue}): setValue(${value}): will return initialValue because encountered error: ${error} `
      );
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // WARNING: React/Next.js expects _hooks to render in the same order_ at static gen time and in the browser.
  // This means that the two calls to useState() above must happen whether or not hasMounted is true.
  // Take care to run all your hooks first, and do not conditionally return before all hooks are called.
  if (!hasMounted) {
    return [initialValue, () => {}];
  } else {
    return [storedValue, setValue];
  }
};
