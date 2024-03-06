import { useRef } from "react";

import { useIdempotentLoggedState } from "~/hooks/useLoggedState";
import { useIsomorphicLayoutEffect } from "~/hooks/useIsomorphicLayoutEffect";
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
  useIsomorphicLayoutEffect(() => {
    setElementRect(
      elementRef.current
        ? elementRef.current.getBoundingClientRect()
        : new FakeDOMRect()
    );
    // Because callbackDependencies must come from the caller,
    // we can't use the eslint rule of exhaustive-deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...callbackDependencies, elementRef, setElementRect]);
  return [elementRef, elementRect];
};
