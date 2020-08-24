import { useState, useEffect } from "react";

import log from "loglevel";

import { useWindowSize } from "~/hooks/useWindowSize";
import {
  Point,
  absolutifyRect,
} from "~/lib/geometry"
import {
  keyHandleDomIdFromKeyId,
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/keyConnections";

/* A key connection
 * sourceCoords: Coordinates for a source element in the key info panel
 * targetCoords: Coordinates for a target key in the keyboard
 * targetKeyId: ID for the target key
 */
class Connection {
  constructor(sourceCoords, targetCoords, targetKeyId, targetHandle) {
    this.sourceCoords = sourceCoords;
    this.targetCoords = targetCoords;
    this.targetKeyId = targetKeyId;
    this.targetHandle = targetHandle;
  }
}


/* Return a new Point, representing a location for the diagram lines to connect on a source element
 *
 * Consider using a handle div like we do inside <Key> ?
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
  return new Point(topLineRect.x, topLineRect.bottom)
};

/* Return a new Point, representing a location for the diagram lines to connect on a target element
 */
const connectionPointTo = (element) => {
  const rect = absolutifyRect(element.getBoundingClientRect());
  return new Point(rect.x, rect.y);
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
const getKeyConnections = () => {
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

/* Use key connections
 *
 * Return key connections and a list of target key IDs,
 * and set an effect hook to update these values when necessary.
 *
 * fromKey:               The current key. When this changes, the key info will change,
 *                        so we have to getKeyConnections() again.
 * keyboardStartHeight:   The starting height of the <Keyboard> component. When this changes,
 *                        the coordinates of all keys and identifiers will change,
 *                        so we have to getKeyConnections() again.
 */
export const useKeyConnections = (fromKey, keyboardStartHeight) => {
  const [connections, setConnections] = useState();
  const [targetKeyIds, setTargetKeyIds] = useState();
  const windowSize = useWindowSize();

  useEffect(() => {
    const data = getKeyConnections();
    setConnections(data.connections);
    setTargetKeyIds(data.targetKeyIds);
  }, [fromKey, keyboardStartHeight, windowSize]);

  return {
    connections,
    targetKeyIds,
  };
};
