import { PhysicalKey } from "~/lib/physicalKey";
import { KeyBoard } from "~/webcomponents/key-board";
import { KeyMap, KeyMapKey } from "~/lib/keyMap";
import { KeyGrid } from "~/webcomponents/key-grid";
import { KeyboardKey } from "./keyboard-key";
import { Point, Size } from "~/lib/geometry";

/* An ErgoDox keyboard.
 *
 * Create child elements directly,
 * or use the createChildren() method to create them from state data.
 */
export class KeyBoardTitleBar extends KeyBoard {
  keyMap: KeyMap | null = null;
  keyMapKey: KeyMapKey | null = null;
  keyElement: KeyboardKey | null = null;
  physicalKeys: PhysicalKey[] = [];
  titleKey: PhysicalKey;

  constructor() {
    super();
    this.titleKey = new PhysicalKey(
      "title-bar",
      new Point(0, 0),
      new Size(2, 2)
    );
    this.physicalKeys = [this.titleKey];
  }

  name = "TitleBar";

  _grid: KeyGrid | null = null;
  get grid(): KeyGrid {
    if (!this._grid) {
      this._grid = this.querySelector("key-grid") as KeyGrid;
    }
    if (!this._grid) {
      this._grid = document.createElement("key-grid") as KeyGrid;
      this.appendChild(this._grid);
    }
    return this._grid;
  }

  connectedCallback() {
    this.grid.setAttribute("name", "title-bar");
    this.grid.setAttribute("ignore-clicks", "true");
    // TODO: don't hard code cols/rows
    this.grid.setAttribute("cols", "3");
    this.grid.setAttribute("rows", "4");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}

  /* Update the selected key.
   *
   * Creates a new KeyMapKey object with the same data as the selected key,
   * but with changes made so it can be displayed in the title bar.
   * Returns that object.
   */
  updateSelectedKey(
    keyMap: KeyMap,
    keyBoard: KeyBoard,
    selectedKeyId: string
  ): KeyMapKey {
    this.keyMap = keyMap;

    if (!selectedKeyId) {
      this.keyMapKey = new KeyMapKey({
        name: "unset",
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
        new Size(2, 2) // TODO: the default size is arbitrary, should be configurable by the keyboard?
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
      const activePhysicalKey = keyBoard.getPhysicalKey(selectedKeyId);

      this.titleKey.size.x = activePhysicalKey.size.x;
      this.titleKey.size.y = activePhysicalKey.size.y;
    }

    this.grid.removeAllChildren();
    this.grid.createKeys(this, [this.keyMapKey]);
    this.keyElement = this.grid.keyElements[0];
    this.keyElement.setAttribute("position", this.titleKey.positionAttribute);

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
