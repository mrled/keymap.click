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
