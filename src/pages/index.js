import React, { useCallback, useEffect, useState } from "react";

/* Hook to show the window size
 */
export function useWindowSize() {
  const isClient = typeof window === "object";

  const getSize = useCallback(() => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }, [isClient]);

  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getSize, isClient]);

  return windowSize;
}

/* Get a callback reference and an automatically updated bounding rect for it.
 *
 * Takes a list of dependencies to pass to useCallback.
 *
 * Expects that elementRef is passed as `ref=` to exactly one element.
 */
const useBoundingClientRect = (callbackDependencies) => {
  const [elementRect, setElementRect] = useState(null);
  const elementRef = useCallback((node) => {
    if (node != null) setElementRect(node.getBoundingClientRect());
  }, callbackDependencies);
  return [elementRef, elementRect];
};

/* The main component
 */
export default function Home() {
  const windowSize = useWindowSize();

  const [keyboardAndPanel, keyboardAndPanelRect] = useBoundingClientRect([
    windowSize,
  ]);
  const [diamargLeft, diamargLeftRect] = useBoundingClientRect([
    keyboardAndPanelRect,
  ]);
  const [diamargRight, diamargRightRect] = useBoundingClientRect([
    keyboardAndPanelRect,
  ]);
  const [keyInfoContainer, keyInfoContainerRect] = useBoundingClientRect([
    windowSize,
  ]);

  return (
    <>
      <div className="w-full h-full text-sm md:text-base p-4 max-w-screen-lg mx-auto">
        <div className="w-full md:mr-8 md:px-4">
          <div className="flex" id="keymap-ui-kid-container">
            <div
              className="flex flex-col kid-diamarg m-0 p-0 border-0 bg-red-300"
              ref={diamargLeft}
            >
              <p className="text-xs">
                height {diamargLeftRect ? diamargLeftRect.height : "NULL"}px
              </p>
            </div>

            <div
              className="flex flex-col w-12 m-0 p-0 border-0"
              ref={keyboardAndPanel}
            >
              <div
                className="bottom-auto top-0 left-0 right-0 border border-gray-300 bg-gray-100 rounded-md p-4 mb-4 mx-auto w-full bg-teal-300"
                ref={keyInfoContainer}
              >
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>

            <div
              className="flex flex-col kid-diamarg m-0 p-0 border-0 bg-red-300"
              ref={diamargRight}
            >
              <p className="text-xs">
                height {diamargRightRect ? diamargRightRect.height : "NULL"}px
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
