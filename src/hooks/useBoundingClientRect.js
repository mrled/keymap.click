import { useCallback } from "react";

import { useLoggedState } from "~/hooks/useLoggedState";

/* Get a callback reference and an automatically updated bounding rect for it.
 *
 * Takes a list of dependencies to pass to useCallback.
 *
 * Expects that elementRef is passed as `ref=` to exactly one element.
 */
export const useBoundingClientRect = (callbackDependencies, stateLogName) => {
  const [elementRect, setElementRect] = useLoggedState(null, stateLogName);
  const elementRef = useCallback((node) => {
    if (node != null) setElementRect(node.getBoundingClientRect());
  }, callbackDependencies);
  return [elementRef, elementRect];
};
