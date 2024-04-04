import { PhysicalKey } from "~/lib/physicalKey";
import { KeyBoard } from "~/webcomponents/key-board";
import { KeyMap, KeyMapKey } from "~/lib/keyMap";
import { KeyGrid } from "~/webcomponents/key-grid";
import { KeyboardKey } from "./keyboard-key";
import { Point, Size } from "~/lib/geometry";
import { KeyBoardModel } from "~/lib/KeyboardModel";

/* The faux keyboard in the title bar.
 *
 * It will contain just one key, which will be a copy of the selected key in the reference keyboard.
 */
export class KeyBoardTitleBar extends KeyBoard {
  keyMap: KeyMap | null = null;
  keyMapKey: KeyMapKey | null = null;
  keyElement: KeyboardKey | null = null;
  private _physicalKeys: PhysicalKey[] = [];
  titleKey: PhysicalKey;
  private _model: KeyBoardModel;

  constructor() {
    super();
    this.titleKey = new PhysicalKey(
      "title-bar",
      new Point(0, 0),
      // This doesn't matter; it will be set in updateSelectedKey()
      new Size(1, 1)
    );
    this._physicalKeys = [this.titleKey];
    this._model = new KeyBoardModel(
      "key-board-title-bar",
      new Point(2, 2),
      new Size(2, 2),
      this._physicalKeys
    );
  }

  readonly elementName = "key-board-title-bar";

  get model(): KeyBoardModel {
    return this._model;
  }

  _referenceModel: KeyBoardModel | null = null;
  get referenceModel(): KeyBoardModel | null {
    return this._referenceModel;
  }
  set referenceModel(model: KeyBoardModel | null) {
    this._referenceModel = model;
    if (model) {
      this._model = new KeyBoardModel(
        this.elementName,
        model.defaultBlankKeySize,
        model.maxKeySize,
        this._physicalKeys
      );
    }
  }

  _grid: KeyGrid | null = null;
  get grid(): KeyGrid {
    if (!this._grid) {
      this._grid = this.querySelector("key-grid") as KeyGrid;
    }
    if (!this._grid) {
      this._grid = document.createElement("key-grid") as KeyGrid;
      this.appendChild(this._grid);
      this.grid.setAttribute("name", "title-bar");
    }
    return this._grid;
  }

  connectedCallback() {}

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}

  /* Update the selected key.
   *
   * Creates a new KeyMapKey object with the same data as the selected key,
   * but with changes made so it can be displayed in the title bar.
   * Returns that object.
   *
   * Parameters:
   * - keyMap: the key map
   * - referenceModel: the model for the keyboard being displayed in the main area
   * - selectedKeyId: the ID of the selected key
   */
  updateSelectedKey(
    keyMap: KeyMap,
    referenceModel: KeyBoardModel,
    selectedKeyId: string
  ): KeyMapKey {
    this.keyMap = keyMap;

    this.grid.setAttribute("cols", this.model.maxKeySize.x.toString());
    this.grid.setAttribute("rows", this.model.maxKeySize.y.toString());

    if (!selectedKeyId) {
      this.keyMapKey = new KeyMapKey({
        name: "",
        id: "title-bar-0-0",
        info: [],
        selection: [],
        textLegend: "",
        imagePath: "",
        imageAttribution: "",
        unset: true,
      });

      this.titleKey = new PhysicalKey(
        "title-bar",
        new Point(0, 0),
        this.model.defaultBlankKeySize
      );
    } else {
      const selectedKey = keyMap.keys.get(selectedKeyId);
      if (!selectedKey) {
        throw new Error(`Key not found: ${selectedKeyId}`);
      }
      this.keyMapKey = new KeyMapKey({
        name: selectedKey.name,
        id: "title-bar-0-0",
        info: selectedKey.info.map((s) => s),
        selection: [],
        textLegend: selectedKey.textLegend,
        imagePath: selectedKey.imagePath,
        imageAttribution: selectedKey.imageAttribution,
        unset: selectedKey.unset,
      });
      const activePhysicalKey = referenceModel.getPhysicalKey(selectedKeyId);

      this.titleKey.size.x = activePhysicalKey.size.x;
      this.titleKey.size.y = activePhysicalKey.size.y;
    }

    this.grid.removeAllChildren();
    this.grid.createKeys(this, [this.keyMapKey]);
    this.keyElement = this.grid.keyElements[0];
    this.keyElement.setAttribute("position", this.titleKey.positionAttribute);
    this.keyElement.setAttribute("active", "true");
    this.keyElement.onclick = () => {};

    return this.keyMapKey;
  }

  createChildren(keys: KeyMapKey[]) {
    // TODO: handle this more elegantly
    throw new Error(
      "You don't want to call createChildren() on KeyBoardTitleBar; use updateSelectedKey() instead."
    );
  }

  removeAllChildren() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }
}
