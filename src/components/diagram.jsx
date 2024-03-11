import React, { useRef } from "react";

import log from "loglevel";

import { useAppSettings } from "~/hooks/useAppSettings";
import { useIsomorphicLayoutEffect } from "~/hooks/useIsomorphicLayoutEffect";
import { useWhyDidYouUpdate } from "~/hooks/useWhyDidYouUpdate";
import { drawDiagram } from "~/lib/diagram";

/* A diagram, where we draw lines from the key info panel to the board.
 * This component contains a <canvas> element and is overlaid on top of the entire document.
 */
export const Diagram = (props) => {
  const {
    connections,
    keyboardAndPanelRect,
    diamargLeftRect,
    diamargRightRect,
    keyInfoContainerRect,
    documentDimensions,
    windowSize,
  } = props;
  useWhyDidYouUpdate("Diagram", props);

  const canvas = useRef();
  const container = useRef();
  const { debugLevel } = useAppSettings();

  useIsomorphicLayoutEffect(() => {
    if (!canvas) return;
    if (!canvas.current) return;

    /* Without setting the h/w here, canvas will be some arbitrary small size
     * canvas.style.{w/h} is the CSS 'style' property of the element in the DOM,
     * while canvas.{w/h} is the _internal_ dimensions for drawing on.
     * We want our canvas to cover the entire screen,
     * so this relies on the container being position: absolute in the top left
     * and width/height at 100%,
     * while the canvas should also be position: absolute and overflow: visible.
     */
    canvas.current.style.width = `${documentDimensions.width}px`;
    canvas.current.style.height = `${documentDimensions.height}px`;
    canvas.current.width = documentDimensions.width;
    canvas.current.height = documentDimensions.height;

    log.debug(
      `New canvas sizes:\n${canvas.current.style.width} * ${canvas.current.style.height}\n${canvas.current.width} * ${canvas.current.height}`
    );
  }, [documentDimensions, windowSize]);

  useIsomorphicLayoutEffect(() => {
    drawDiagram(
      canvas,
      connections,
      keyboardAndPanelRect,
      debugLevel,
      diamargLeftRect,
      diamargRightRect,
      keyInfoContainerRect
    );
  }, [
    debugLevel,
    connections,
    diamargLeftRect,
    diamargRightRect,
    documentDimensions,
    keyboardAndPanelRect,
    windowSize,
    keyInfoContainerRect,
  ]);

  return (
    <div
      ref={container}
      id="debug-canvas-container"
      className="diagram-canvas-container"
    >
      <canvas
        ref={canvas}
        id="debug-canvas"
        className="keyboard-diagram debug-border-orange debug-trans-bg-orange"
      />
    </div>
  );
};
