/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

import { KeyMapKey } from "~/lib/keyMap";
import { KeyboardKey } from "./keyboard-key";
import { KeyBoardModel } from "~/lib/KeyboardModel";

export abstract class KeyBoard extends HTMLElement {
  constructor() {
    super();
  }

  /* The element name of the keyboard.
   * This name should be passed to customElements.define() when registering the keyboard.
   *
   * Subclasses must implement this getter.
   */
  abstract readonly elementName: string;

  /* The model for the keyboard, contains information about physical keys etc.
   */
  abstract model: KeyBoardModel;

  /* Get all the child <keyboard-key> elements.
   */
  get keyElements() {
    return Array.from(this.querySelectorAll("keyboard-key")) as KeyboardKey[];
  }

  /* Subclasses should implement this method to create child elements.
   */
  abstract createChildren(keys: KeyMapKey[]): void;

  /* A helper to remove all child elements.
   */
  removeAllChildren() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }
}
