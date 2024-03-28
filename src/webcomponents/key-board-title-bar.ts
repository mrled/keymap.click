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
      // This doesn't matter; it will be set in updateSelectedKey()
      new Size(1, 1)
    );
    this.physicalKeys = [this.titleKey];
  }

  name = "TitleBar";

  _referenceBoard: KeyBoard | null = null;
  get referenceBoard(): KeyBoard | null {
    return this._referenceBoard;
  }
  set referenceBoard(board: KeyBoard | null) {
    this._referenceBoard = board;
    if (board) {
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
    }
    return this._grid;
  }

  connectedCallback() {
    this.grid.setAttribute("name", "title-bar");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}

  /* Update the selected key.
   *
   * Creates a new KeyMapKey object with the same data as the selected key,
   * but with changes made so it can be displayed in the title bar.
   * Returns that object.
   *
   * Parameters:
   * - keyMap: the key map
   * - referenceKeyBoard: the keyboard being displayed in the main area
   * - selectedKeyId: the ID of the selected key
   */
  updateSelectedKey(
    keyMap: KeyMap,
    referenceKeyBoard: KeyBoard,
    selectedKeyId: string
  ): KeyMapKey {
    this.keyMap = keyMap;

    this.grid.setAttribute("cols", referenceKeyBoard.maxKeyWidth.toString());
    this.grid.setAttribute("rows", referenceKeyBoard.maxKeyHeight.toString());

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
        referenceKeyBoard.defaultBlankKeySize
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
      const activePhysicalKey = referenceKeyBoard.getPhysicalKey(selectedKeyId);

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
