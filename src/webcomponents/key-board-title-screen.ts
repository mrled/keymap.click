import { PhysicalKey } from "~/lib/physicalKey";
import { KeyBoard } from "~/webcomponents/key-board";
import { KeyMapKey } from "~/lib/keyMap";
import { Point, Size } from "~/lib/geometry";
import { KeyGrid } from "~/webcomponents/key-grid";

/* An ErgoDox keyboard.
 */
export class KeyBoardTitleScreen extends KeyBoard {
  constructor() {
    super();
  }

  name = "TitleBoard";

  get elementName(): string {
    return "key-board-title-screen";
  }

  /* The size of the blank key to display in the title bar when no key is selected.
   */
  get defaultBlankKeySize(): Point {
    return new Point(2, 2);
  }

  /* The maximum height of a key on the keyboard
   */
  get maxKeyHeight() {
    return 2;
  }

  /* The maximum width of a key on the keyboard
   */
  get maxKeyWidth() {
    return 2;
  }

  /* The physical keys on the board.
   */
  private _physicalKeys: PhysicalKey[] = [];
  get physicalKeys(): PhysicalKey[] {
    if (this._physicalKeys.length === 0) {
      this._physicalKeys = [
        new PhysicalKey("title-screen", new Point(1, 1), new Size(2, 2)), // K
        new PhysicalKey("title-screen", new Point(3, 1), new Size(2, 2)), // E
        new PhysicalKey("title-screen", new Point(5, 1), new Size(2, 2)), // Y
        new PhysicalKey("title-screen", new Point(7, 1), new Size(2, 2)), // M
        new PhysicalKey("title-screen", new Point(9, 1), new Size(2, 2)), // A
        new PhysicalKey("title-screen", new Point(11, 1), new Size(2, 2)), // P
        new PhysicalKey("title-screen", new Point(13, 1), new Size(2, 2)), // .
        new PhysicalKey("title-screen", new Point(15, 1), new Size(2, 2)), // C
        new PhysicalKey("title-screen", new Point(17, 1), new Size(2, 2)), // L
        new PhysicalKey("title-screen", new Point(19, 1), new Size(2, 2)), // I
        new PhysicalKey("title-screen", new Point(21, 1), new Size(2, 2)), // C
        new PhysicalKey("title-screen", new Point(23, 1), new Size(2, 2)), // K
      ];
    }
    return this._physicalKeys;
  }

  /* Create key-grid and keyboard-key elements from key data for this board.
   */
  createChildren(keys: KeyMapKey[]) {
    this.removeAllChildren();

    const title = document.createElement("h2");
    title.textContent = "Title Board";
    this.appendChild(title);

    const gridContainer = document.createElement("div");
    gridContainer.className = "keygrid-container";
    this.appendChild(gridContainer);

    const keygrid = document.createElement("key-grid") as KeyGrid;
    keygrid.setAttribute("name", "title-screen");
    keygrid.setAttribute("cols", "24");
    keygrid.setAttribute("rows", "2");
    keygrid.createKeys(this, keys);
    gridContainer.appendChild(keygrid);
  }
}
