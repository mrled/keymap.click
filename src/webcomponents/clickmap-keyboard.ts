/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

import { KeymapKey } from "~/lib/Keymap";
import { ClickmapKeyElement } from "./clickmap-key";
import { KeyboardModel } from "~/lib/KeyboardModel";

export abstract class ClickmapKeyboardElement extends HTMLElement {
  /* A ResizeObserver to watch for changes in the board's size
   * and recalculate the size of the board.
   */
  resizeObserver: ResizeObserver = new ResizeObserver(() =>
    this.calculateSize()
  );

  constructor() {
    super();
  }

  /* The element name of the keyboard.
   * This name should be passed to customElements.define() when registering the keyboard.
   *
   * Subclasses must implement this property.
   *
   * Note that in addition to this INSTANCE property,
   * there will usually also be a STATIC property of the same name.
   * The clickmap UI and state uses the instance property;
   * the customElements.define() call uses the static property.
   * TODO: Can we make this nicer?
   * I think we can't; TypeScript doesn't support abstract static properties or interface static properties.
   *
   * The recommended approach is to define the static property
   * and then have the instance property return the static property.
   */
  static readonly elementName: string;
  abstract readonly elementName: string;

  /* Subclasses are welcome to override  connectedCallback(),
   * but they should call super.connectedCallback() in their implementation.
   */
  connectedCallback() {
    // When the element is connected to the DOM, calculate the size of the board.
    this.calculateSize();
    // When the element is resized, recalculate the size of the board.
    this.resizeObserver.observe(this);
  }

  /* The model for the keyboard, contains information about physical keys etc.
   */
  abstract model: KeyboardModel;

  /* Get all the child <clickmap-key> elements.
   */
  get keyElements() {
    return Array.from(
      this.querySelectorAll(ClickmapKeyElement.elementName)
    ) as ClickmapKeyElement[];
  }

  /* Subclasses should implement this method to create child elements.
   */
  abstract createChildren(keys: KeymapKey[]): void;

  /* A helper to remove all child elements.
   */
  removeAllChildren() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /* Implement this method to properly calculate the size of the board.
   *
   * It will be called when the board element is connected to the DOM
   * and when the window is resized.
   */
  calculateSize() {}
}
