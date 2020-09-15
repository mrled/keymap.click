import { useCallback, useState } from "react";

/* Get a callback reference and an automatically updated bounding rect for it.
 *
 * Takes a list of dependencies to pass to useCallback.
 *
 * Expects that elementRef is passed as `ref=` to exactly one element.
 */
export const useBoundingClientRect = (callbackDependencies) => {
  const [elementRect, setElementRect] = useState(null);
  const elementRef = useCallback((node) => {
    if (node != null) setElementRect(node.getBoundingClientRect());
  }, callbackDependencies);
  return [elementRef, elementRect];
};
