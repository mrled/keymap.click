/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

import { KeyMap, KeyMapKey } from "~/lib/keyMap";
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

  /* A helper that provides a blank KeyMapKey for each physical key.
   */
  get blankKeyMapKeys(): KeyMapKey[] {
    return this.model.physicalKeys.map(
      (key) => new KeyMapKey({ name: "", id: key.id, info: [""], unset: true })
    );
  }

  /* A helper that provides a blank KeyMap for the keyboard.
   */
  get blankKeyMap(): KeyMap {
    return new KeyMap({
      displayName: "Blank keymap",
      uniqueId: "blank",
      model: this.model,
      welcome: ["This is a blank key map"],
      keys: this.blankKeyMapKeys,
      guides: [],
    });
  }
}
