/* A simple point
 */
export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
  }
  static fromRect(rect: DOMRect) {
    return new Point(rect.x, rect.y);
  }
}

/* A simple size
 */
export class Size extends Point {}

/* Return a new rect with absolute positioning
 */
export const absolutifyRect = (rect: DOMRect) => {
  const abs = DOMRect.fromRect(rect);
  abs.x += window.scrollX;
  abs.y += window.scrollY;
  return abs;
};

/* Return a new rect inside the input rect
 */
export const smallerRect = (rect: DOMRect, offset: number = 5) => {
  const newRect = DOMRect.fromRect(rect);
  newRect.x += offset;
  newRect.width -= 2 * offset;
  newRect.y += offset;
  newRect.height -= 2 * offset;
  return newRect;
};

/* Trace a rect
 * rect:    An existing DOMRect
 * context: Ah HTML canvas context
 */
export const traceRect = (rect: DOMRect, context: CanvasRenderingContext2D) => {
  context.moveTo(rect.left, rect.top);
  context.lineTo(rect.left, rect.bottom);
  context.lineTo(rect.right, rect.bottom);
  context.lineTo(rect.right, rect.top);
  context.lineTo(rect.left, rect.top);
};

/* Unfuck DOMRect objects
 *
 * Per MDN:
 * <https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect>
 * "Properties in the returned DOMRect object are not own properties.
 * While the in operator and for...in will find returned properties,
 * other APIs such as Object.keys() will fail.
 * Moreover, and unexpectedly, the ES2015 and newer features
 * such as Object.assign() and object rest/spread
 * will fail to copy returned properties."
 *
 * ... I'm sorry fucking what.
 *
 * TODO: is this still necessary in 2024?
 */
export const domrect2obj = (r: DOMRect) => {
  const { top, right, bottom, left, width, height, x, y } = r;
  return { top, right, bottom, left, width, height, x, y };
};

/* Test if an object is a DOMRect
 *
 * DOMRect objects are totally fucked (per above),
 * and we have to resort to this bullshit to detect them.
 * Fucking incredible.
 *
 * TODO: is this still necessary in 2024?
 */
export const isDOMRect = (obj: any) => {
  return Object.getPrototypeOf(obj) === Object.getPrototypeOf(new DOMRect());
};

export const eqDOMRect = (rect1: DOMRect, rect2: DOMRect) => {
  if (!rect1 && !rect2) {
    return true;
  } else if (!rect1 || !rect2) {
    return false;
  }
  return (
    rect1.left === rect2.left &&
    rect1.top === rect2.top &&
    rect1.right === rect2.right &&
    rect1.bottom === rect2.bottom &&
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.x === rect2.x &&
    rect1.y === rect2.y
  );
};
