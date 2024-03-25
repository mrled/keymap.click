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
