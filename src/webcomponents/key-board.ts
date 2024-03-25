/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

import { KeyMap, KeyMapKey } from "~/lib/keyMap";
import { PhysicalKey } from "~/lib/physicalKey";
import { KeyboardKey } from "./keyboard-key";

type KeyIdToPhysicalKeyMap = { [key: string]: PhysicalKey };

export abstract class KeyBoard extends HTMLElement {
  constructor() {
    super();
  }

  name: string = "Keyboard Base Class";

  /* Subclasses should implement this method to return a list of physical key objects
   */
  abstract get physicalKeys(): PhysicalKey[];

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
   * TODO: This isn't cached, not sure if we can cache it??
   */
  get keyElements() {
    return Array.from(this.querySelectorAll("button")).filter(
      (b) => b.getAttribute("is") === "keyboard-key"
    ) as KeyboardKey[];
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
      (key) => new KeyMapKey({ name: "unset", id: key.id, info: ["Unset"] })
    );
  }

  /* A helper that provides a blank KeyMap for the keyboard.
   */
  get blankKeyMap(): KeyMap {
    return new KeyMap({
      name: "blank",
      welcome: ["This is a blank key map"],
      keys: this.blankKeyMapKeys,
      guides: [],
    });
  }
}
