import { useState, useEffect } from "react";
import log from "loglevel";

/* Return the center of the document
 */
export const documentScrollCenter = () => {
  const center = document.documentElement.scrollWidth / 2;
  return center;
}

/* A simple point
 */
export class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  static fromRect(rect) {
    return new Point(rect.x, rect.y);
  }
}

/* A key connection
 * sourceCoords: Coordinates for a source element in the key info panel
 * targetCoords: Coordinates for a target key in the keyboard
 * targetKeyId: ID for the target key
 */
export class Connection {
  constructor(sourceCoords, targetCoords, targetKeyId, targetHandle) {
    this.sourceCoords = sourceCoords;
    this.targetCoords = targetCoords;
    this.targetKeyId = targetKeyId;
    this.targetHandle = targetHandle;
  }

  get margin() {
    console.log(`documentScrollCenter: ${documentScrollCenter()}; targetCoords.x: ${this.targetCoords.x}`)
    return (documentScrollCenter() < this.targetCoords.x) ? 'r' : 'l';
  }
}

/* An element with this class is identified as physical key indicator
 */
export const keyInfoConnectFromClass = "key-info-connect-from";

/* An indicator must have another class whose name starts with this value
 * to identify the key it points to,
 * and ends with a key identifier.
 * For example, 'key-info-connect-from-l-f-3-1'
 * points to the key with the identifier 'l-f-3-1'.
 * There must be a key in the keyboard with a CSS id of that identifier.
 * In this example, it denotes the _l_eft half, _f_inger cluster, column 3, row 1.
 */
export const keyInfoConnectFromClassPrefix = "key-info-connect-from-";

/* The string used as the DOM ID for a key's handle
 */
export const keyHandleDomIdFromKeyId = (keyId) => {
  return `${keyId}-handle`;
}

const absolutifyRect = (rect) => {
  const abs = DOMRect.fromRect(rect);
  abs.x += window.scrollX;
  abs.y += window.scrollY;
  return abs;
};

/* Return a new Point, representing a location for the diagram lines to connect on a source element
 */
const connectionPointFrom = (element) => {
  /* Could use element.getBoundingClientRect(),
   * but if the text is split between two or more lines that'll make a rectangle larger that I want.
   * I use the first rect in the return value of .getClientRects() instead
   * to get a rectangle around _just_ the section on the top line.
   *
   * We use the mid point on the Y axis,
   * and a bit inward from the boundary on the X axis.
   * We multiply by Math.sign() of the width to ensure correct behavior is width is negative.
   */
  const topLineRect = absolutifyRect(element.getClientRects()[0]);
  const inwardX = topLineRect.x + Math.sign(topLineRect.width) * 3;
  const midPointY = topLineRect.y + topLineRect.height / 2;
  return new Point(inwardX, midPointY);
};

/* Return a new Point, representing a location for the diagram lines to connect on a target element
 */
const connectionPointTo = (element) => {
  const rect = absolutifyRect(element.getBoundingClientRect());
  // TODO: clean this up, and change connectionPointFrom() to use a handle div like we do inside <Key>
  //const inwardX = rect.x + Math.sign(rect.width) * 5;
  //const inwardY = rect.y + Math.sign(rect.height) * 5;
  const [inwardX, inwardY] = [rect.x, rect.y];
  return new Point(inwardX, inwardY);
};

/* Return a list of connections that need to be drawn as lines on the diagram.
 * Scan the whole DOM for every indicator to a keyboard key.
 *   Assumes that each indicator has at least two CSS classes set -
 *   The literal keyInfoConnectFromClass, and a class whose name starts with keyInfoConnectFromClassPrefix.
 *   An indicator can point to more than one key.
 * Returns a list of connections.
 * Each connection is a list containing a pair of [source, target] coordinates.
 *   The target must be identified with a CSS id of the key identifier.
 * Each coordinate is a Point.
 */
export const getKeyConnections = () => {
  // A list of all the indicators in the DOM
  const renderedKeyIndicators = document.getElementsByClassName(
    keyInfoConnectFromClass
  );

  var connections = [];
  var targetKeys = [];
  for (let indicator of renderedKeyIndicators) {
    const sourceCoords = connectionPointFrom(indicator);

    // Convert the indicator class names to a list of bare indicator strings,
    // e.g. key-info-connect-from-l-f-1-1 => l-f-1-1
    const targetKeyIds = indicator.className
      .split(" ")
      .filter((cls) => cls.startsWith(keyInfoConnectFromClassPrefix))
      .map((cls) => cls.slice(keyInfoConnectFromClassPrefix.length));

    targetKeyIds.forEach((targetKeyId) => {
      targetKeys.push(targetKeyId);
      const targetKeyHandle = document.getElementById(keyHandleDomIdFromKeyId(targetKeyId));
      const targetCoords = connectionPointTo(targetKeyHandle);
      log.debug(
        `Found key connection from source at ${sourceCoords.x},${sourceCoords.y}`,
        `to target key with ID ${targetKeyId} at ${targetCoords.x},${targetCoords.y}`
      );
      const connection = new Connection(sourceCoords, targetCoords, targetKeyId, targetKeyHandle);
      connections.push(connection);
    });
  }
  return {
    connections: connections,
    targetKeyIds: targetKeys,
  };
};

export const useKeyConnections = (effectProps = []) => {
  const [connections, setConnections] = useState();
  const [targetKeyIds, setTargetKeyIds] = useState();

  useEffect(() => {
    const data = getKeyConnections();
    setConnections(data.connections);
    setTargetKeyIds(data.targetKeyIds);
  }, effectProps); // the effectProps here contains the window size. When that changes, we run this function.

  return {
    connections,
    targetKeyIds,
  };
};
