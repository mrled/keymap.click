import { useLayoutEffect, useRef } from "react";

import { useIdempotentLoggedState } from "~/hooks/useLoggedState";
import { eqDOMRect, FakeDOMRect } from "~/lib/geometry";

/* Get a callback reference and an automatically updated bounding rect for it.
 *
 * Takes a list of dependencies to pass to useLayoutEffect.
 *
 * Expects that elementRef is passed as `ref=` to exactly one element.
 */
export const useBoundingClientRect = (callbackDependencies, stateLogName) => {
  const [elementRect, setElementRect] = useIdempotentLoggedState(
    null,
    stateLogName,
    eqDOMRect
  );
  const elementRef = useRef();
  useLayoutEffect(() => {
    setElementRect(
      elementRef.current
        ? elementRef.current.getBoundingClientRect()
        : new FakeDOMRect()
    );
  }, [...callbackDependencies, elementRef.current]);
  return [elementRef, elementRect];
};
