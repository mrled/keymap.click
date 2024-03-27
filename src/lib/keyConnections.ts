import { Point, absolutifyRect } from "~/lib/geometry.js";

/* A key connection
 * sourceCoords:    Coordinates for a source element in the key info panel.
 * targetCoords:    Coordinates for a target key in the keyboard.
 * targetKeyId:     ID for the target key.
 * type:            A KeyInfoConnectType value.
 * TODO: do we need targetKeyId at all?
 */
export class Connection {
  sourceCoords: Point;
  targetCoords: Point;
  targetKeyId: string;
  connectionType: KeyInfoConnectType;

  constructor(
    sourceCoords: Point,
    targetCoords: Point,
    targetKeyId: string,
    connectionType: KeyInfoConnectType
  ) {
    this.sourceCoords = sourceCoords;
    this.targetCoords = targetCoords;
    this.targetKeyId = targetKeyId;
    this.connectionType = connectionType;
  }

  stringify() {
    const srcCoords = JSON.stringify(this.sourceCoords);
    const tgtCoords = JSON.stringify(this.targetCoords);
    return `Connection: ${srcCoords} => ${tgtCoords} (${this.connectionType})`;
  }
}

/* A pair of elements that will be connected on the diagram.
 *
 * Contains the elements themselves -- not coordinates.
 * We want to be able to track which elements are connected,
 * without having to re-query the DOM for them,
 * so we can update the diagram when their positions change,
 * perhaps if the window is resized.
 *
 * Arguments:
 *   source:    The source element
 *   target:    The target element
 *   type:      Either "textref" (green) or "selected" (orange).
 */
export class ConnectionPair {
  source: Element;
  target: Element;
  type: KeyInfoConnectType;

  constructor(source: Element, target: Element, type: KeyInfoConnectType) {
    this.source = source;
    this.target = target;
    this.type = type;
  }

  get connection() {
    const sourceCoords = connectionPointFrom(this.source);
    const targetCoords = connectionPointTo(this.target);
    const targetKeyId = this.target.getAttribute("id") || "";
    return new Connection(sourceCoords, targetCoords, targetKeyId, this.type);
  }
}

/* Return a new Point, representing a location for the diagram lines to connect on a source element
 */
export const connectionPointFrom = (element: Element) => {
  /* The sources of connections may be a <keyboard-key>, a <kbd>, or a <span>.
   * In the case of the <span>, the text may be split across multiple lines.
   * In that case, if we use element.getBoundingClientRect(),
   * that'll make a rectangle larger that I want.
   * I use the first rect in the return value of .getClientRects() instead
   * to get a rectangle around _just_ the section on the top line.
   */
  const topLineRect = absolutifyRect(element.getClientRects()[0]);
  return new Point(topLineRect.x, topLineRect.bottom);
};

/* Return a new Point, representing a location for the diagram lines to connect on a target element
 */
export const connectionPointTo = (element: Element) => {
  const rect = absolutifyRect(element.getBoundingClientRect());
  return new Point(rect.x, rect.y);
};

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
 * See also KeyInfoConnectType enum.
 */
export const keyInfoConnectTypeClassPrefix = "key-info-connect-type-";

/* The string used as the DOM ID for a key's handle
 */
export const keyHandleDomIdFromKeyId = (keyId: string) => {
  return `${keyId}-handle`;
};

/* Types of key info connections.
 * Selected: The user- or guide- selected key. There is only ever one of these.
 * TextRef: A key referenced in text from the key info panel. Zero, one, two, or more are possible.
 */
export enum KeyInfoConnectType {
  TextRef = "textref",
  Selected = "selected",
}
