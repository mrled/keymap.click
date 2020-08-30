/* A key connection
 * sourceCoords:    Coordinates for a source element in the key info panel.
 * targetCoords:    Coordinates for a target key in the keyboard.
 * targetKeyId:     ID for the target key.
 * targetHandle:    Key handle <div> element; an actual DOM object.
 * type:            Either "textref" (green) or "selected" (orange).
 *                  See also keyInfoConnectType object
 */
export class Connection {
  constructor(
    sourceCoords,
    targetCoords,
    targetKeyId,
    targetHandle,
    connectionType = defaultKeyInfoConnectType,
  ) {
    this.sourceCoords = sourceCoords;
    this.targetCoords = targetCoords;
    this.targetKeyId = targetKeyId;
    this.targetHandle = targetHandle;
    this.connectionType = connectionType;
  }

  stringify() {
    const srcCoords = JSON.stringify(this.sourceCoords);
    const tgtCoords = JSON.stringify(this.targetCoords);
    return `Connection: ${srcCoords} => ${tgtCoords} (${this.connectionType})`
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

/* To specify the type of indicator, prefix the type with this string.
 * Either "textref" (green) or "selected" (orange).
 * See also keyInfoConnectType object.
 */
export const keyInfoConnectTypeClassPrefix = "key-info-connect-type-";

/* The string used as the DOM ID for a key's handle
 */
export const keyHandleDomIdFromKeyId = (keyId) => {
  return `${keyId}-handle`;
}

/* Types of key info connections.
 * selected: The user- or guide- selected key. Always a single value.
 * textref: A key referenced in text from the key info panel. Zero, one, two, or more are possible.
 */
export const keyInfoConnectType = {
  textref: "textref",
  selected: "selected",
};

export const defaultKeyInfoConnectType = keyInfoConnectType.textref;