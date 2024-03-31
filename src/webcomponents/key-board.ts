/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

import { KeyMap, KeyMapKey } from "~/lib/keyMap";
import { PhysicalKey } from "~/lib/physicalKey";
import { KeyboardKey } from "./keyboard-key";
import { Point } from "~/lib/geometry";

type KeyIdToPhysicalKeyMap = { [key: string]: PhysicalKey };

export abstract class KeyBoard extends HTMLElement {
  constructor() {
    super();
  }

  /* The name of the keyboard.
   * Subclasses should override this to some meaningful name,
   * and instances can override it to something more specific.
   */
  name: string = "Keyboard Instance";

  /* The element name of the keyboard.
   * This name should be passed to customElements.define() when registering the keyboard.
   *
   * Subclasses must implement this getter.
   */
  get elementName(): string {
    throw new Error("Subclasses must implement this getter.");
  }

  /* The size of the blank key to display in the title bar when no key is selected.
   */
  get defaultBlankKeySize(): Point {
    return new Point(2, 2);
  }

  /* The maximum height of a key on the keyboard
   */
  get maxKeyHeight() {
    return 4;
  }

  /* The maximum width of a key on the keyboard
   */
  get maxKeyWidth() {
    return 3;
  }

  /* Subclasses should implement this method to return a list of physical key objects
   */
  get physicalKeys(): PhysicalKey[] {
    return [];
  }

  /* A map of string key IDs to PhysicalKey objects.
   */
  private _physicalKeyMap: KeyIdToPhysicalKeyMap = {};
  get physicalKeyMap() {
    if (Object.keys(this._physicalKeyMap).length === 0) {
      this._physicalKeyMap = this.physicalKeys.reduce(
        (acc: KeyIdToPhysicalKeyMap, key: PhysicalKey) => {
          acc[key.id] = key;
          return acc;
        },
        {}
      );
    }
    return this._physicalKeyMap;
  }

  /* Get a physical key by its ID, or throw an error if not found.
   */
  getPhysicalKey(id: string) {
    const key = this.physicalKeyMap[id];
    if (!key) {
      throw new Error(`Physical key not found with id '${id}'`);
    }
    return key;
  }

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
    return this.physicalKeys.map(
      (key) => new KeyMapKey({ name: "", id: key.id, info: [""], unset: true })
    );
  }

  /* A helper that provides a blank KeyMap for the keyboard.
   */
  get blankKeyMap(): KeyMap {
    return new KeyMap({
      displayName: "Blank keymap",
      uniqueId: "blank",
      keyboardElementName: this.elementName,
      welcome: ["This is a blank key map"],
      keys: this.blankKeyMapKeys,
      guides: [],
    });
  }
}
