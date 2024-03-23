import log from "loglevel";

import { smallerRect, traceRect } from "~/lib/geometry";
import { KeyInfoConnectType } from "~/lib/keyConnections";

/* Return a new leftRightObject
 *
 * A leftRightObject is a JavaScript object with a 'true' key and a 'false' key.
 * 'true' represents an object on the right; 'false' represents an object on the left.
 * e.g.:
 *
 *    const lrObj = newLeftRightObject(0, 0);
 *    const leftOrRight = calculateLeftOrRight();
 *    lrObj[leftOrRight] = 'something';
 */
const newLeftRightObject = (initialLeft = 0, initialRight = 0) => {
  return { true: initialRight, false: initialLeft };
};

/* Colors when drawing diagram lines
 * TODO: does this belong in CSS?
 */
const diagramLineColors = {
  [KeyInfoConnectType.TextRef]: "#68d391ff", // Opaque, because this green is pretty light
  [KeyInfoConnectType.Selected]: "#fbd38d99", // Slightly transparent, because this orange is pretty dark
  debugCenterLine: "cornflowerblue",
  debugKeyboard: "khaki",
  debugLeft: "lawngreen",
  debugRight: "red",
};

/* Draw debugging lines for visual debugging mode
 */
const drawVisualDebugInfo = (
  context,
  keyboardCenter,
  keyboardAndPanelRect,
  diamargLeftRect,
  diamargRightRect
) => {
  log.debug(`diagram: visual debugging enabled`);
  context.lineWidth = 2;

  // Draw a rectangle inset from the three KID elements.
  // Show we can track their outline as they change in size.
  // Also draw a line down the center of the keyboard.

  if (keyboardAndPanelRect) {
    log.debug(
      `Drawing into the keyboard/panel rectangle`,
      keyboardAndPanelRect
    );
    context.beginPath();
    context.strokeStyle = diagramLineColors.debugCenterLine;
    context.moveTo(keyboardCenter, 0);
    var idx = 0;
    while (idx <= document.documentElement.scrollHeight) {
      context.lineTo(keyboardCenter + 10, idx);
      context.moveTo(keyboardCenter, idx);
      context.lineTo(keyboardCenter, idx + 100);
      idx += 100;
    }
    context.stroke();

    context.strokeStyle = diagramLineColors.debugKeyboard;
    context.beginPath();
    traceRect(smallerRect(keyboardAndPanelRect), context);
    context.stroke();
  } else {
    log.debug(
      `diagram: could not draw center line because there was no keyboardAndPanelRect`
    );
  }

  if (diamargLeftRect) {
    log.debug(`Drawing into diamargLeftRect`, diamargLeftRect);
    const diamargLeftRectInner = smallerRect(diamargLeftRect);
    context.strokeStyle = diagramLineColors.debugLeft;
    context.beginPath();
    traceRect(diamargLeftRectInner, context);
    context.stroke();
  } else {
    log.debug(`diagram: there is no diamargLeftRect`);
  }
  if (diamargRightRect) {
    log.debug(`Drawing into diamargRightRect`, diamargRightRect);
    const diamargRightRectInner = smallerRect(diamargRightRect);
    context.strokeStyle = diagramLineColors.debugRight;
    context.beginPath();
    traceRect(diamargRightRectInner, context);
    context.stroke();
  } else {
    log.debug(`diagram: there is no diamargRightRect`);
  }
};

/* Draw a 'textref' line --
 * that is, a line from key an indicator in the key info panel to a key on the board.
 *
 * context:                           The canvas context
 * connection:                        A Connection object to draw
 * keyboardCenter:                    The X coordinate for the center of the keyboard
 *                                    (not the center of the screen).
 * leftRightSourceYCoordStartList:    A leftRightObj that tracks Y coordinates that already-drawn
 *                                    source diagram lines have started from.
 *                                    Lets us offset horizontal line between source text and
 *                                    diamarg by sourceYInsetTickSize so that lines are not drawn
 *                                    on top of each other.
 *                                    (This function mutates this value.)
 * sourceYInsetTickSize:              The distance between horizontal lines under the text
 * diamargRightRect:                  The right diamarg DOMRect
 * diamargLeftRect:                   The left diamarg DOMRect
 * leftRightIdx:                      A leftRightObj that tracks the number of vertical lines.
 *                                    (This function mutates this value.)
 * marginInsetTickSize:               The distance between vertical lines in the margin
 */
const drawDiagramLineTextref = (
  context,
  connection,
  keyboardCenter,
  leftRightSourceYCoordStartList,
  sourceYInsetTickSize,
  diamargRightRect,
  diamargLeftRect,
  leftRightIdx,
  marginInsetTickSize
) => {
  const source = connection.sourceCoords;
  const target = connection.targetCoords;
  const lineType = KeyInfoConnectType[connection.connectionType];

  context.strokeStyle = diagramLineColors[lineType];
  context.lineWidth = 1;
  context.beginPath();

  const rightMargin = keyboardCenter < target.x;

  const calculateSourceYCoord = (
    initialSourceYCoord,
    alreadySeenCoords,
    tickSize
  ) => {
    let result = initialSourceYCoord;
    let idx = 0;
    while (alreadySeenCoords.indexOf(result) > -1) {
      if (idx > 100) {
        throw new Error(`This is probably an infinite loop`);
      }
      result += tickSize;
      idx += 1;
    }
    log.debug(
      `Selected source Y coordinate of ${result} from initial value of ${initialSourceYCoord}`
    );
    alreadySeenCoords.push(result);
    return [result, alreadySeenCoords];
  };

  const [sourceInsetY, newCoordList] = calculateSourceYCoord(
    source.y,
    leftRightSourceYCoordStartList[rightMargin],
    sourceYInsetTickSize
  );
  leftRightSourceYCoordStartList[rightMargin] = newCoordList;

  /* Return the X coordinate for the vertical line
   */
  const calculateMarginXCoord = (marginRect, rightMargin, idx, tickSize) => {
    const inset = idx * tickSize;
    const offsetMultiplier = rightMargin ? -1 : 1;
    const offset = inset * offsetMultiplier;
    const offsetFrom = rightMargin ? marginRect.right : marginRect.left;
    return offsetFrom + offset;
  };

  const diamargRect = rightMargin ? diamargRightRect : diamargLeftRect;
  const marginX = calculateMarginXCoord(
    diamargRect,
    rightMargin,
    leftRightIdx[rightMargin],
    marginInsetTickSize
  );

  context.moveTo(source.x, source.y);
  context.lineTo(source.x, sourceInsetY);
  context.lineTo(marginX, sourceInsetY);
  context.lineTo(marginX, target.y);
  context.lineTo(target.x, target.y);

  context.stroke();

  leftRightIdx[rightMargin] += 1;
};

/* Draw a 'selected' diagram line --
 * lines from the title bar key in the key info panel to the key on the board.
 */
const drawDiagramLineSelected = (
  context,
  connection
  // keyInfoTop,
) => {
  const source = connection.sourceCoords;
  const target = connection.targetCoords;
  const lineType = KeyInfoConnectType[connection.connectionType];

  context.strokeStyle = diagramLineColors[lineType];
  context.lineWidth = 2;
  context.beginPath();

  /* HACK: calculating the middle horizontal line relative to the top of the key info panel
   * works beautifully on desktop, but breaks terribly on iOS for some reason.
   * Instead, I use a constant offset from the top of the navbar key grid.
   * A dumbshit hack, but it does work and looks ok on both desktop and mobile.
   */
  // const keyInfoTopOffset = 5;
  // const middleLineY = keyInfoTop - keyInfoTopOffset;
  const middleLineY = source.y - 45;

  context.moveTo(source.x, source.y);
  context.lineTo(source.x, middleLineY);
  context.lineTo(target.x, middleLineY);
  context.lineTo(target.x, target.y);

  context.stroke();
};

/* Draw the entire diagram
 *
 * Arguments:
 * canvas: The canvas element
 * connections: An array of Connection objects
 * keyboardAndPanelRect: The bounding rectangle of the keyboard and info panel
 * diamargLeftRect: The left diamarg DOMRect
 * diamargRightRect: The right diamarg DOMRect
 * keyInfoContainerRect: The key info panel DOMRect
 * debugLevel: The debug level
 */
export const drawDiagram = (
  canvas,
  connections,
  keyboardAndPanelRect,
  diamargLeftRect,
  diamargRightRect,
  keyInfoContainerRect,
  debugLevel
) => {
  const context = canvas.getContext("2d");

  /* Clear the canvas completely before drawing
   * Without this, fast refresh during development will show old paths and new paths
   * until you fully reload the page (e.g. with ctrl-r)
   */
  context.clearRect(0, 0, canvas.width, canvas.height);

  /* Convert all coordinates to those within the canvas element.
   * Our canvas does not cover the whole document,
   * so we have to subtract the top and left of the canvas from all coordinates.
   */
  // TODO: is this the cleanest way to do this?
  const canvasRect = canvas.getBoundingClientRect();
  keyboardAndPanelRect.x -= canvasRect.left;
  keyboardAndPanelRect.y -= canvasRect.top;
  diamargLeftRect.x -= canvasRect.left;
  diamargLeftRect.y -= canvasRect.top;
  diamargRightRect.x -= canvasRect.left;
  diamargRightRect.y -= canvasRect.top;
  keyInfoContainerRect.x -= canvasRect.left;
  keyInfoContainerRect.y -= canvasRect.top;
  connections.forEach((connection) => {
    connection.sourceCoords.x -= canvasRect.left;
    connection.sourceCoords.y -= canvasRect.top;
    connection.targetCoords.x -= canvasRect.left;
    connection.targetCoords.y -= canvasRect.top;
  });

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
  if (!keyboardAndPanelRect) {
    log.debug("keyboardAndPanelRect is null?");
    return;
  }

  const keyboardCenter =
    keyboardAndPanelRect.x +
    (keyboardAndPanelRect.right - keyboardAndPanelRect.x) / 2;

  if (debugLevel > 1) {
    drawVisualDebugInfo(
      context,
      keyboardCenter,
      keyboardAndPanelRect,
      diamargLeftRect,
      diamargRightRect
    );
  }

  // the distance between vertical lines in the margin
  const marginInsetTickSize = 5;

  // the distance between horizontal lines from the source text to the margin
  const sourceYInsetTickSize = 3;

  // keep track of number of vertical lines in each diamarg.
  let leftRightIdx = newLeftRightObject(0, 0);

  // keep track of Y coordinates that source diagram lines have started from.
  let leftRightSourceYCoordStartList = newLeftRightObject([], []);

  connections.forEach((connection) => {
    log.debug(`Drawing connection ${connection.stringify()}`);

    if (connection.connectionType == KeyInfoConnectType.TextRef) {
      drawDiagramLineTextref(
        context,
        connection,
        keyboardCenter,
        leftRightSourceYCoordStartList,
        sourceYInsetTickSize,
        diamargRightRect,
        diamargLeftRect,
        leftRightIdx,
        marginInsetTickSize
      );
    } else if (connection.connectionType == KeyInfoConnectType.Selected) {
      drawDiagramLineSelected(context, connection, keyInfoContainerRect.top);
    }
  });
};
