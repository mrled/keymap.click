import log from "loglevel";

import { smallerRect, traceRect } from "~/lib/geometry";
import { Connection, KeyInfoConnectType } from "~/lib/keyConnections";

/* Colors when drawing diagram lines
 * TODO: does this belong in CSS?
 */
const diagramLineColors: { [key: string]: string } = {
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
  context: CanvasRenderingContext2D,
  keyboardCenter: number,
  keyboardAndPanelRect: DOMRect,
  diamargLeftRect: DOMRect,
  diamargRightRect: DOMRect
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
 * leftDiagramYCoordinates:           An array of Y coordinates in the left margin
 *                                    that have already been drawn on.
 *                                    (This function mutates this value.)
 * rightDiagramYCoordinates:         rAn array of Y coordinates in the right margin
 *                                    that have already been drawn on.
 *                                    (This function mutates this value.)
 * sourceYInsetTickSize:              The distance between horizontal lines under the text
 * diamargRightRect:                  The right diamarg DOMRect
 * diamargLeftRect:                   The left diamarg DOMRect
 * marginInsetTickSize:               The distance between vertical lines in the margin
 */
const drawDiagramLineTextref = (
  context: CanvasRenderingContext2D,
  connection: Connection,
  keyboardCenter: number,
  leftDiagramYCoordinates: number[],
  rightDiagramYCoordinates: number[],
  sourceYInsetTickSize: number,
  diamargRightRect: DOMRect,
  diamargLeftRect: DOMRect,
  marginInsetTickSize: number
) => {
  const source = connection.sourceCoords;
  const target = connection.targetCoords;

  context.strokeStyle = diagramLineColors[connection.connectionType];
  context.lineWidth = 1;
  context.beginPath();

  // If true, draw this diagram line in the right margin; otherwise, the left
  const rightMargin = keyboardCenter < target.x;

  const alreadySeenCoords = rightMargin
    ? rightDiagramYCoordinates
    : leftDiagramYCoordinates;
  if (alreadySeenCoords.length > 100) {
    throw new Error(`This is probably an infinite loop`);
  }
  let sourceInsetY = source.y;
  while (alreadySeenCoords.indexOf(sourceInsetY) > -1) {
    sourceInsetY += sourceYInsetTickSize;
  }
  alreadySeenCoords.push(sourceInsetY);
  log.debug(
    `Selected source Y coordinate of ${sourceInsetY} from initial value of ${source.y}`
  );

  const diamargRect = rightMargin ? diamargRightRect : diamargLeftRect;

  const marginXInset = alreadySeenCoords.length * marginInsetTickSize;
  const marginXOffsetMultiplier = rightMargin ? -1 : 1;
  const marginXOffset = marginXInset * marginXOffsetMultiplier;
  const marginXFrom = rightMargin ? diamargRect.right : diamargRect.left;
  const marginX = marginXFrom + marginXOffset;

  context.moveTo(source.x, source.y);
  context.lineTo(source.x, sourceInsetY);
  context.lineTo(marginX, sourceInsetY);
  context.lineTo(marginX, target.y);
  context.lineTo(target.x, target.y);

  context.stroke();

  // leftRightIdx[rightMargin] += 1;
};

/* Draw a 'selected' diagram line --
 * lines from the title bar key in the key info panel to the key on the board.
 */
const drawDiagramLineSelected = (
  context: CanvasRenderingContext2D,
  connection: Connection
  // keyInfoTop,
) => {
  const source = connection.sourceCoords;
  const target = connection.targetCoords;

  context.strokeStyle = diagramLineColors[connection.connectionType];
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
  canvas: HTMLCanvasElement,
  connections: Connection[],
  keyboardAndPanelRect: DOMRect,
  diamargLeftRect: DOMRect,
  diamargRightRect: DOMRect,
  keyInfoContainerRect: DOMRect,
  debugLevel: number
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    log.error("Could not get context for canvas");
    return;
  }

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

  // Arrays of Y coordinates in the margins that have already been drawn on.
  let leftDiagramYCoordinates: number[] = [];
  let rightDiagramYCoordinates: number[] = [];

  connections.forEach((connection: Connection) => {
    log.debug(`Drawing connection ${connection.stringify()}`);

    if (connection.connectionType == KeyInfoConnectType.TextRef) {
      drawDiagramLineTextref(
        context,
        connection,
        keyboardCenter,
        leftDiagramYCoordinates,
        rightDiagramYCoordinates,
        sourceYInsetTickSize,
        diamargRightRect,
        diamargLeftRect,
        marginInsetTickSize
      );
    } else if (connection.connectionType == KeyInfoConnectType.Selected) {
      drawDiagramLineSelected(context, connection);
    }
  });
};
