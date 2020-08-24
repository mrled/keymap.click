import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import log from "loglevel";

import {
  AppDebugContext,
  DocumentDimensionsContext,
} from "~/components/appContext";
import {
  smallerRect,
  traceRect,
} from "~/lib/geometry";
import {
  useWindowSize,
} from "~/lib/hooks";

export const Diagram = ({ connections, keyboardAndPanelRect, diamargLeftRect, diamargRightRect }) => {
  const canvas = useRef();
  const container = useRef();
  const [documentDimensions, updateDocumentDimensions] = useContext(DocumentDimensionsContext)
  const windowSize = useWindowSize();
  const [appDebug, setAppDebug] = useContext(AppDebugContext);

  const updateCanvasSize = useCallback(() => {
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

    log.debug(`New canvas sizes:\n${canvas.current.style.width} * ${canvas.current.style.height}\n${canvas.current.width} * ${canvas.current.height}`);
  }, [documentDimensions]);

  useEffect(() => {
    updateCanvasSize();
  }, [documentDimensions, updateCanvasSize, windowSize]);

  const drawVisualDebugInfo = (context, keyboardCenter, keyboardAndPanelRect, diamargLeftRect, diamargRightRect) => {
    log.debug(`diagram: visual debugging enabled`);
    context.lineWidth = 2;

    // Draw a rectangle inset from the three KID elements.
    // Show we can track their outline as they change in size.
    // Also draw a line down the center of the keyboard.

    if (keyboardAndPanelRect) {
      log.debug(`Drawing into the keyboard/panel rectangle...`)
      context.beginPath();
      context.strokeStyle = "purple";
      context.moveTo(keyboardCenter, 0);
      var idx = 0;
      while (idx <= document.documentElement.scrollHeight) {
        context.lineTo(keyboardCenter + 10, idx);
        context.moveTo(keyboardCenter, idx);
        context.lineTo(keyboardCenter, idx + 100);
        idx += 100;
      }
      context.stroke();

      context.strokeStyle = "purple";
      context.beginPath();
      traceRect(smallerRect(keyboardAndPanelRect), context);
      context.stroke()
    } else {
      log.debug(`diagram: could not draw center line because there was no keyboardAndPanelRect`);
    }

    if (diamargLeftRect) {
      const diamargLeftRectInner = smallerRect(diamargLeftRect);
      context.strokeStyle = "purple";
      context.beginPath();
      traceRect(diamargLeftRectInner, context);
      context.stroke()
    } else {
      log.debug(`diagram: there is no diamargLeftRect`);
    }
    if (diamargRightRect) {
      const diamargRightRectInner = smallerRect(diamargRightRect);
      context.strokeStyle = "purple";
      context.beginPath();
      traceRect(diamargRightRectInner, context);
      context.stroke()
    } else {
      log.debug(`diagram: there is no diamargRightRect`);
    }
  }

  const updateCanvas = useCallback(() => {
    if (!canvas) return;
    if (!canvas.current) return;

    const context = canvas.current.getContext("2d");

    /* Clear the canvas completely before drawing
     * Without this, fast refresh during development will show old paths and new paths
     * until you fully reload the page (e.g. with ctrl-r)
     */
    context.clearRect(0, 0, canvas.current.width, canvas.current.height);

    /* Draw each connection
     * Now that the canvas is the size of the entire screen,
     * we can easily just draw lines connecting the bounding rectangles of the sources/targets.
     */
    log.debug(`The lines object is a ${typeof connections}, and it logs as:`);
    log.debug(connections);
    if (!connections) {
      log.debug("No connections to set");
      return;
    }

    const keyboardCenter = keyboardAndPanelRect.x + (keyboardAndPanelRect.right - keyboardAndPanelRect.x) / 2;

    if (appDebug.debugLevel > 1) {
      drawVisualDebugInfo(context, keyboardCenter, keyboardAndPanelRect, diamargLeftRect, diamargRightRect);
    }

    context.strokeStyle = "#68d391";
    context.lineWidth = 1;
    context.beginPath();

    /* marginInsetTickSize: the distance between vertical lines in the margin
     */
    const marginInsetTickSize = 5;

    /* sourceYInsetTickSize: the distance between horizontal lines from the source text to the margin
     */
    const sourceYInsetTickSize = 3;

    /* leftRightIdx: keep track of number of vertical lines in each diamarg.
     * right = true and left = false.
     * leftRightIdx[rightMargin] will return the number of vertical lines in the current diamarg
     * in the body of the forEach function below.
     */
    const leftRightIdx = { true: 0, false: 0 };

    /* leftRightSourceYCoordStartList: keep track of Y coordinates that source diagram lines have started from.
     * With this info, we can offset the horizontal line between the source text and the diamarg
     * by some small amount so that two horizontal lines are not drawn on top of each other.
     * leftRightSourceYCoordStartList[rightMargin] will return the Y coordinates that have been found in the correct diamarg
     * in the body of the forEach function below.
     */
    let leftRightSourceYCoordStartList = { true: [], false: [], };

    connections.forEach((connection) => {
      const source = connection.sourceCoords;
      const target = connection.targetCoords;
      if (!source || !target) {
        log.debug(`Connection is not complete, skipping: ${connection}`)
        return
      }
      const rightMargin = keyboardCenter < target.x;

      const calculateSourceYCoord = (initialSourceYCoord, alreadySeenCoords, tickSize) => {
        let result = initialSourceYCoord;
        let idx = 0;
        while (alreadySeenCoords.indexOf(result) > -1) {
          if (idx > 100) {
            throw new Error(`This is probably an infinite loop`)
          }
          result += tickSize;
          idx += 1;
        }
        log.debug(`Selected source Y coordinate of ${result} from initial value of ${initialSourceYCoord}`);
        alreadySeenCoords.push(result);
        return [result, alreadySeenCoords];
      }

      const [sourceInsetY, newCoordList] = calculateSourceYCoord(source.y, leftRightSourceYCoordStartList[rightMargin], sourceYInsetTickSize)
      leftRightSourceYCoordStartList[rightMargin] = newCoordList;

      /* Return the X coordinate for the vertical line
       */
      const calculateMarginXCoord = (marginRect, rightMargin, idx, tickSize) => {
        const inset = idx * tickSize;
        const offsetMultiplier = rightMargin ? -1 : 1;
        const offset = inset * offsetMultiplier;
        const offsetFrom = rightMargin ? marginRect.right : marginRect.left;
        return offsetFrom + offset;
      }

      const diamargRect = rightMargin ? diamargRightRect : diamargLeftRect;
      const marginX = calculateMarginXCoord(diamargRect, rightMargin, leftRightIdx[rightMargin], marginInsetTickSize)

      context.moveTo(source.x, source.y);
      context.lineTo(source.x, sourceInsetY);
      context.lineTo(marginX, sourceInsetY);
      context.lineTo(marginX, target.y);
      context.lineTo(target.x, target.y);

      leftRightIdx[rightMargin] += 1;
    });
    context.stroke();
  }, [appDebug.debugLevel, connections, diamargLeftRect, diamargRightRect, keyboardAndPanelRect]);

  useEffect(() => {
    updateCanvas();
  }, [appDebug, connections, diamargLeftRect, diamargRightRect, documentDimensions, keyboardAndPanelRect, updateCanvas, windowSize]);

  return (
    <div
      ref={container}
      id="debug-canvas-container"
      className="absolute top-0 left-0 pointer-events-none z-50"
    >
      <canvas
        ref={canvas}
        id="debug-canvas"
        className="absolute overflow-visible debug-border-orange debug-trans-bg-orange"
      />
    </div>
  );
};
