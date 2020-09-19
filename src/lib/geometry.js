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

/* Return a new rect with absolute positioning
 */
export const absolutifyRect = (rect) => {
  const abs = DOMRect.fromRect(rect);
  abs.x += window.scrollX;
  abs.y += window.scrollY;
  return abs;
};

/* Why the fuck is the DOMRect constructor considered experimental?
 */
export class FakeDOMRect {
  constructor(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  }
}

/* Return a new rect inside the input rect
 */
export const smallerRect = (rect, offset = 5) => {
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
export const traceRect = (rect, context) => {
  context.moveTo(rect.left, rect.top);
  context.lineTo(rect.left, rect.bottom);
  context.lineTo(rect.right, rect.bottom);
  context.lineTo(rect.right, rect.top);
  context.lineTo(rect.left, rect.top);
};

/* Compare the .width and .height properties on two objects
 */
export const sizeObjEq = (size1, size2) => {
  return size1.width === size2.width && size1.height === size2.height;
};
