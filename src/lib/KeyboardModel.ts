/* A model representing a keyboard.
 *
 * Specific boards should extend this class.
 */

import { PhysicalKey } from "~/lib/physicalKey";
import { Point } from "~/lib/geometry";

type KeyIdToPhysicalKeyMap = { [key: string]: PhysicalKey };

export class KeyBoardModel {
  constructor(
    //The element name for the keyboard that this instance models
    public readonly keyboardElementName: string,

    // The size of the blank key to display in the title bar when no key is selected.
    public readonly defaultBlankKeySize: Point = new Point(2, 2),

    // The maximum height of any key on the keyboard
    public readonly maxKeyHeight: number = 4,

    // The maximum width of any key on the keyboard
    public readonly maxKeyWidth: number = 4,

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
}
