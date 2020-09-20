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
 */
export const domrect2obj = (r) => {
  const { top, right, bottom, left, width, height, x, y } = r;
  return { top, right, bottom, left, width, height, x, y };
};

/* Test if an object is a DOMRect
 *
 * DOMRect objects are totally fucked (per above),
 * and we have to resort to this bullshit to detect them.
 * Fucking incredible.
 */
export const isDOMRect = (obj) => {
  return Object.getPrototypeOf(obj) === Object.getPrototypeOf(new DOMRect());
};

export const eqDOMRect = (rect1, rect2) => {
  const rectKeys = [
    "top",
    "right",
    "bottom",
    "left",
    "width",
    "height",
    "x",
    "y",
  ];
  if (!rect1 && !rect2) {
    return true;
  } else if (!rect1 || !rect2) {
    return false;
  }
  for (let idx = 0; idx < rectKeys.length; ++idx) {
    let key = rectKeys[idx];
    if (rect1[key] != rect2[key]) {
      return false;
    }
  }
  return true;
};
