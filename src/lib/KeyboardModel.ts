/* A model representing a keyboard.
 *
 * Specific boards should extend this class.
 */

import { PhysicalKey } from "~/lib/physicalKey";
import { Point, Size } from "~/lib/geometry";
import { KeyMap, KeyMapKey, KeyMapLayer } from "~/lib/keyMap";

type KeyIdToPhysicalKeyMap = { [key: string]: PhysicalKey };

export class KeyBoardModel {
  constructor(
    //The element name for the keyboard that this instance models
    public readonly keyboardElementName: string,

    // The size of the blank key to display in the title bar when no key is selected.
    public readonly defaultBlankKeySize: Point = new Point(2, 2),

    // The maximum dimensions of any key on the keyboard.
    public readonly maxKeySize: Size = new Size(4, 4),

    // A list of physical key objects on the board
    public readonly physicalKeys: PhysicalKey[] = []
  ) {}

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
      model: this,
      layers: [
        KeyMapLayer.fromKeyList({
          displayName: "Blank layer",
          welcome: ["No keymap selected"],
          keys: this.blankKeyMapKeys,
        }),
      ],
      guides: [],
    });
  }
}
