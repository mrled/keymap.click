import { KeyBoard } from "~/webcomponents/key-board";

/* A key in a keymap.
 *
 * name:              The name of the key; must be unique within the key map
 * id:                The ID of the physical key this key corresponds to
 * description:       An array of paragraphs describing the key; may contain HTML
 * selection:         An array of key IDs that are part of the same selection group,
 *                    which should be highlighted together when the key is selected,
 *                    e.g. all the QWERTY keys or both shift keys etc
 * textLegend:        Text legend for the key; optional
 * imageLegendPath:   The path on the server to an image to display; optional
 * imageLegendAttr:   The attribution for the image; optional
 *
 * For the legend, an image is used if provided, otherwise text legend if provided, otherwise the name.
 */
export class KeyMapKey {
  readonly name: string;
  readonly id;
  readonly info: string[];
  readonly selection?: string[];
  readonly textLegend?: string;
  readonly imagePath?: string;
  readonly imageAttribution?: string;
  readonly unset?: boolean = false;

  constructor({
    name,
    id,
    info,
    selection,
    textLegend,
    imagePath,
    imageAttribution,
    unset,
  }: {
    name: string;
    id: string;
    info: string[];
    selection?: string[];
    textLegend?: string;
    imagePath?: string;
    imageAttribution?: string;
    unset?: boolean;
  }) {
    this.name = name;
    this.id = id;
    this.info = info;
    this.selection = selection;
    this.textLegend = textLegend;
    this.imagePath = imagePath;
    this.imageAttribution = imageAttribution;
    this.unset = unset || false;
  }
}

/* A single step in a guided tour of a layout.
 *
 * keyId:      The ID of a key to highlight; optional
 * title:      The title of the step; required if keyId is not provided
 * text:       The text of the step; required if keyId is not provided
 * selection:  An array of key IDs to highlight together; optional
 *
 * A guide step may either point to a key by its ID,
 * which will show that key's description from the key map and highlight it,
 * or it may provide a title and text to display.
 * In either case, it may also provide an array of key IDs to highlight together.
 */
export class GuideStep {
  readonly keyId?: string;
  readonly title?: string;
  readonly text?: string[];
  readonly selection?: string[];

  constructor({
    keyId,
    title,
    text,
    selection,
  }: {
    keyId?: string;
    title?: string;
    text?: string[];
    selection?: string[];
  }) {
    if (keyId) {
      if (title || text) {
        throw new Error("Key ID must be the only parameter if provided.");
      }
      this.keyId = keyId;
    } else {
      if (!title || !text) {
        throw new Error("Missing required parameters.");
      }
      this.title = title;
      this.text = text;
    }
    this.selection = selection || [];
  }
}

/* A guide to the layout of a key map
 */
export class KeyMapGuide {
  constructor(readonly title: string, readonly steps: GuideStep[]) {}
}

/* A key map for a keyboard.
 *
 * Maps IDs of physical keys to descriptive text and function of the key.
 * May contain guides to the layout.
 * If multiple guides are provided, the first one is the default.
 *
 * Callers may pass an unset key to the constructor,
 * which will be used as the default key if a key ID is not found in the key map.
 *
 * Any keys passed in to the keys parameter will be checked for valid IDs,
 * and an error will be thrown if any are invalid for the keyboard or not unique.
 *
 * TODO: Implement multiple layers.
 */
export class KeyMap {
  displayName: string;
  uniqueId: string;
  welcome: string[];
  guides: KeyMapGuide[];
  keys: Map<string, KeyMapKey>;
  private _duplicateKeys: KeyMapKey[] = [];

  constructor({
    displayName,
    uniqueId,
    welcome,
    keys,
    guides,
  }: {
    displayName: string;
    uniqueId: string;
    welcome: string[];
    keys: KeyMapKey[];
    guides?: KeyMapGuide[];
  }) {
    this.displayName = displayName;
    this.uniqueId = uniqueId;
    this.welcome = welcome;
    this.keys = keys.reduce((map, key) => {
      if (map.has(key.id)) {
        this._duplicateKeys.push(key);
      }
      map.set(key.id, key);
      return map;
    }, new Map<string, KeyMapKey>());
    this.guides = guides || [];
  }

  /* Check that all keys are valid IDs for the keyboard.
   */
  validateKeys(keyboard: KeyBoard) {
    if (this._duplicateKeys.length > 0) {
      throw new Error(
        `Duplicate key IDs in key map: ${this._duplicateKeys
          .map((key) => key.id)
          .join(", ")}`
      );
    }
    for (const key of this.keys.values()) {
      if (keyboard.physicalKeyMap[key.id] === undefined) {
        throw new Error(`Invalid key ID: ${key.id}`);
      }
    }
  }
}
