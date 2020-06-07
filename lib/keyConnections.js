import log from "loglevel";

/* A simple point
 */
export class Point {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }
  static fromRect(rect) {
    return new Point(rect.x, rect.y)
  }
}

/* An element with this class is identified as a pointer to a key
 */
export const keyInfoConnectFromClass = 'key-info-connect-from'

/* A pointer must have another class whose name starts with this value
 * to identify the key it points to,
 * and ends with a key identifier.
 * For example, 'key-info-connect-from-l-f-3-1'
 * points to the key with the identifier 'l-f-3-1'.
 * There must be a key in the keyboard with a CSS id of that identifier.
 * In this example, it denotes the _l_eft half, _f_inger cluster, column 3, row 1.
 */
export const keyInfoConnectFromClassPrefix = 'key-info-connect-from-'

/* Return a new Point, representing a location for the diagram lines to connect on a source element
 */
const connectionPointFrom = (element) => {
  /* Could use keyPointer.getBoundingClientRect(),
   * but if the text is split between two or more lines that'll make a rectangle larger that I want.
   * I use the first rect in the return value of .getClientRects() instead
   * to get a rectangle around _just_ the section on the top line.
   *
   * We use the mid point on the Y axis,
   * and a bit inward from the boundary on the X axis.
   * We multiply by Math.sign() of the width to ensure correct behavior is width is negative.
   */
  const topLineRect = element.getClientRects()[0]
  const inwardX = topLineRect.x + (Math.sign(topLineRect.width) * 3)
  const midPointY = topLineRect.y + (topLineRect.height / 2)
  return new Point(inwardX, midPointY)
}

/* Return a new Point, representing a location for the diagram lines to connect on a target element
 */
const connectionPointTo = (element) => {
  const rect = element.getBoundingClientRect()
  const inwardX = rect.x + (Math.sign(rect.width) * 5)
  const inwardY = rect.y + (Math.sign(rect.height) * 5)
  return new Point(inwardX, inwardY)
}

/* Return a list of connections that need to be drawn as lines on the diagram.
 * Scan the whole DOM for every pointer to a keyboard key.
 *   Assumes that each pointer has at least two CSS classes set -
 *   The literal keyInfoConnectFromClass, and a class whose name starts with keyInfoConnectFromClassPrefix.
 *   A key pointer can point to more than one key.
 * Returns a list of connections.
 * Each connection is a list containing a pair of [source, target] coordinates.
 *   The target must be identified with a CSS id of the key identifier.
 * Each coordinate is a Point.
 */
export const getKeyConnections = () => {
  // A list of all the key pointers in the DOM
  const renderedKeyPointers = document.getElementsByClassName(keyInfoConnectFromClass)

  var connections = []
  for (let keyPointer of renderedKeyPointers) {
    const sourceCoords = connectionPointFrom(keyPointer)

    // Convert the key pointer class names to a list of bare key pointers,
    // e.g. key-info-connect-from-l-f-1-1 => l-f-1-1
    const targetKeyIds = keyPointer
      .className
      .split(' ')
      .filter(cls => cls.startsWith(keyInfoConnectFromClassPrefix))
      .map(cls => cls.slice(keyInfoConnectFromClassPrefix.length))

    targetKeyIds.forEach(targetKeyId => {
      const targetCoords = connectionPointTo(document.getElementById(targetKeyId))
      log.debug(
        `Found key connection from source at ${sourceCoords.x},${sourceCoords.y}`,
        `to target key with ID ${targetKeyId} at ${targetCoords.x},${targetCoords.y}`
      )
      connections.push([sourceCoords, targetCoords])
    })
  }
  return connections;
}