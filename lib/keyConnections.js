import log from "loglevel";

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

/* Return a list of connections that need to be drawn as lines on the diagram.
 * Scan the whole DOM for every pointer to a keyboard key.
 *   Assumes that each pointer has at least two CSS classes set -
 *   The literal keyInfoConnectFromClass, and a class whose name starts with keyInfoConnectFromClassPrefix.
 *   A key pointer can point to more than one key.
 * Returns a list of connections.
 * Each connection is a list containing a pair of [source, target] coordinates.
 *   The target must be identified with a CSS id of the key identifier.
 * Each coordinate is a DOMRect.
 */
export const getKeyConnections = () => {
  // TODO: can I put magic strings like this in a central place somewhere?

  // A list of all the key pointers in the DOM
  const renderedKeyPointers = document.getElementsByClassName(keyInfoConnectFromClass)

  var connections = []
  for (let keyPointer of renderedKeyPointers) {
    const sourceCoords = keyPointer.getBoundingClientRect()

    // Convert the key pointer class names to a list of bare key pointers,
    // e.g. key-info-connect-from-l-f-1-1 => l-f-1-1
    const targetKeyIds = keyPointer
      .className
      .split(' ')
      .filter(cls => cls.startsWith(keyInfoConnectFromClassPrefix))
      .map(cls => cls.slice(keyInfoConnectFromClassPrefix.length))

    targetKeyIds.forEach(targetKeyId => {
      const targetKey = document.getElementById(targetKeyId)
      const targetCoords = targetKey.getBoundingClientRect()
      log.debug(
        `Draw on the canvas from source at ${sourceCoords.x},${sourceCoords.y}`,
        `to dest key with ID ${targetKeyId} at ${targetCoords.x},${targetCoords.y}`
      )
      connections.push([sourceCoords, targetCoords])
    })
  }
  return connections;
}