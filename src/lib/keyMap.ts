import { KeyBoard } from "~/webcomponents/key-board";
import { KeyBoardModel } from "./KeyboardModel";

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

/* A single layer is a map of physical key IDs to KeyMapKey objects.
 */
export class KeyMapLayer {
  constructor(
    public readonly displayName: string,
    public readonly welcome: string[],
    public readonly keys: Map<string, KeyMapKey>
  ) {}

  /* Create a new layer from a list of keys.
   *
   * It's nicer to define keys in a list, rather than in a map which must contain the ID twice.
   * This method will check for duplicate keys and throw an error if any are found.
   */
  static fromKeyList({
    displayName,
    welcome,
    keys,
  }: {
    displayName: string;
    welcome: string[];
    keys: KeyMapKey[];
  }) {
    const duplicateKeys: KeyMapKey[] = [];
    const keysById = keys.reduce((map, key) => {
      if (map.has(key.id)) duplicateKeys.push(key);
      map.set(key.id, key);
      return map;
    }, new Map<string, KeyMapKey>());

    // Make sure we haven't passed any keys with duplicate IDs
    if (duplicateKeys.length > 0) {
      throw new Error(
        `Duplicate key IDs in key map: ${duplicateKeys
          .map((key) => key.id)
          .join(", ")}`
      );
    }

    const newLayer = new KeyMapLayer(displayName, welcome, keysById);
    return newLayer;
  }
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
 * Any layer passed in which does not contain all the keys on the keyboard will have unset keys added.
 */
export class KeyMap {
  displayName: string;
  uniqueId: string;
  model: KeyBoardModel;
  guides: KeyMapGuide[];
  layers: KeyMapLayer[] = [];

  constructor({
    displayName,
    uniqueId,
    model,
    layers,
    guides,
  }: {
    displayName: string;
    uniqueId: string;
    model: KeyBoardModel;
    layers: KeyMapLayer[];
    guides?: KeyMapGuide[]; // TODO: implement
  }) {
    this.displayName = displayName;
    this.uniqueId = uniqueId;
    this.model = model;
    this.layers = layers || [];
    this.guides = guides || [];

    this.layers.forEach((layer, layerIdx) => {
      // Add any unset keys to the layer
      model.physicalKeys.forEach((key) => {
        if (!layer.keys.has(key.id)) {
          layer.keys.set(
            key.id,
            new KeyMapKey({
              name: "",
              id: key.id,
              info: [],
              unset: true,
            })
          );
        }
      });

      // Check for any keys in the layer that are not on the keyboard
      const invalidKeys = Array.from(layer.keys.values()).filter(
        (key) => !model.physicalKeyMap[key.id]
      );
      if (invalidKeys.length > 0) {
        const invalidKeysListStr = invalidKeys.map((key) => key.id).join(", ");
        throw new Error(
          `Invalid key IDs in key map ${this.displayName} on layer ${layerIdx}: ${invalidKeysListStr}`
        );
      }
    });
  }
}
