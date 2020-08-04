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

