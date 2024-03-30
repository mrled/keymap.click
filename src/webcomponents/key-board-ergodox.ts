import { PhysicalKey } from "~/lib/physicalKey";
import { KeyBoard } from "~/webcomponents/key-board";
import { KeyMapKey } from "~/lib/keyMap";
import { Point, Size } from "~/lib/geometry";
import { KeyGrid } from "~/webcomponents/key-grid";

/* An ErgoDox keyboard.
 */
export class KeyBoardErgodox extends KeyBoard {
  constructor() {
    super();
  }

  name = "ErgoDox";

  /* The physical keys on the ErgoDox.
   */
  private _physicalKeys: PhysicalKey[] = [];
  get physicalKeys(): PhysicalKey[] {
    if (this._physicalKeys.length === 0) {
      this._physicalKeys = [
        // Left fingers, number row
        new PhysicalKey("l-f", new Point(1, 1), new Size(3, 2)),
        new PhysicalKey("l-f", new Point(4, 1), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(6, 1), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(8, 1), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(10, 1), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(12, 1), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(14, 1), new Size(2, 2)),
        // Left fingers, qwerty row
        new PhysicalKey("l-f", new Point(1, 3), new Size(3, 2)),
        new PhysicalKey("l-f", new Point(4, 3), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(6, 3), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(8, 3), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(10, 3), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(12, 3), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(14, 3), new Size(2, 3)),
        // Left fingers, asdf row
        new PhysicalKey("l-f", new Point(1, 5), new Size(3, 2)),
        new PhysicalKey("l-f", new Point(4, 5), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(6, 5), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(8, 5), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(10, 5), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(12, 5), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(14, 6), new Size(2, 3)),
        // Left fingers, zxcv row
        new PhysicalKey("l-f", new Point(1, 7), new Size(3, 2)),
        new PhysicalKey("l-f", new Point(4, 7), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(6, 7), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(8, 7), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(10, 7), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(12, 7), new Size(2, 2)),
        // Left fingers, bottom row
        new PhysicalKey("l-f", new Point(2, 9), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(4, 9), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(6, 9), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(8, 9), new Size(2, 2)),
        new PhysicalKey("l-f", new Point(10, 9), new Size(2, 2)),
        /* Left thumb
         *
         *       0 2 4
         *     +------+
         *   0 |   A B
         *   2 | C D E
         *   4 | C D F
         */
        new PhysicalKey("l-t", new Point(3, 1), new Size(2, 2)), // A
        new PhysicalKey("l-t", new Point(5, 1), new Size(2, 2)), // B
        new PhysicalKey("l-t", new Point(1, 3), new Size(2, 4)), // C
        new PhysicalKey("l-t", new Point(3, 3), new Size(2, 4)), // D
        new PhysicalKey("l-t", new Point(5, 3), new Size(2, 2)), // E
        new PhysicalKey("l-t", new Point(5, 5), new Size(2, 2)), // F
        // Right fingers, number row
        new PhysicalKey("r-f", new Point(1, 1), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(3, 1), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(5, 1), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(7, 1), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(9, 1), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(11, 1), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(13, 1), new Size(3, 2)),
        // Right fingers, qwerty row
        new PhysicalKey("r-f", new Point(1, 3), new Size(2, 3)),
        new PhysicalKey("r-f", new Point(3, 3), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(5, 3), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(7, 3), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(9, 3), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(11, 3), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(13, 3), new Size(3, 2)),
        // Right fingers, asdf row
        new PhysicalKey("r-f", new Point(1, 6), new Size(2, 3)),
        new PhysicalKey("r-f", new Point(3, 5), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(5, 5), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(7, 5), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(9, 5), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(11, 5), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(13, 5), new Size(3, 2)),
        // Right fingers, zxcv row
        new PhysicalKey("r-f", new Point(3, 7), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(5, 7), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(7, 7), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(9, 7), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(11, 7), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(13, 7), new Size(3, 2)),
        // Right fingers, bottom row
        new PhysicalKey("r-f", new Point(5, 9), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(7, 9), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(9, 9), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(11, 9), new Size(2, 2)),
        new PhysicalKey("r-f", new Point(13, 9), new Size(2, 2)),
        /* Right thumb
         *
         *       0 2 4
         *     +------+
         *   0 | A B
         *   2 | C D E
         *   4 | F D E
         */
        new PhysicalKey("r-t", new Point(1, 1), new Size(2, 2)), // A
        new PhysicalKey("r-t", new Point(3, 1), new Size(2, 2)), // B
        new PhysicalKey("r-t", new Point(1, 3), new Size(2, 2)), // C
        new PhysicalKey("r-t", new Point(3, 3), new Size(2, 4)), // D
        new PhysicalKey("r-t", new Point(5, 3), new Size(2, 4)), // E
        new PhysicalKey("r-t", new Point(1, 5), new Size(2, 2)), // F
      ];
    }
    return this._physicalKeys;
  }

  /* Create key-grid and keyboard-key elements from key data for this board.
   */
  createChildren(keys: KeyMapKey[]) {
    this.removeAllChildren();

    const leftSubBoard = document.createElement("div");
    leftSubBoard.className = "keyboard-sub-board keyboard-sub-board-left";
    this.appendChild(leftSubBoard);

    const leftTitle = document.createElement("h2");
    leftTitle.textContent = "Left hand";
    leftSubBoard.appendChild(leftTitle);

    const leftGridContainer = document.createElement("div");
    leftGridContainer.className = "keygrid-container";
    leftSubBoard.appendChild(leftGridContainer);

    const leftFingerGrid = document.createElement("key-grid") as KeyGrid;
    leftFingerGrid.setAttribute("name", "ergodox-left-finger");
    leftFingerGrid.setAttribute("cols", "15");
    leftFingerGrid.setAttribute("rows", "10");
    const leftFingerKeys = keys.filter(
      (key) => this.getPhysicalKey(key.id).boardId === "l-f"
    );
    leftFingerGrid.createKeys(this, leftFingerKeys);
    leftGridContainer.appendChild(leftFingerGrid);

    const leftThumbGrid = document.createElement("key-grid") as KeyGrid;
    leftThumbGrid.setAttribute("name", "ergodox-left-thumb");
    leftThumbGrid.setAttribute("cols", "6");
    leftThumbGrid.setAttribute("rows", "6");
    const leftThumbKeys = keys.filter(
      (key) => this.getPhysicalKey(key.id).boardId === "l-t"
    );
    leftThumbGrid.createKeys(this, leftThumbKeys);
    leftGridContainer.appendChild(leftThumbGrid);

    const rightSubBoard = document.createElement("div");
    rightSubBoard.className = "keyboard-sub-board keyboard-sub-board-right";
    this.appendChild(rightSubBoard);

    const rightTitle = document.createElement("h2");
    rightTitle.textContent = "Right hand";
    rightSubBoard.appendChild(rightTitle);

    const rightGridContainer = document.createElement("div");
    rightGridContainer.className = "keygrid-container";
    rightSubBoard.appendChild(rightGridContainer);

    const rightFingerGrid = document.createElement("key-grid") as KeyGrid;
    rightFingerGrid.setAttribute("name", "ergodox-right-finger");
    rightFingerGrid.setAttribute("cols", "15");
    rightFingerGrid.setAttribute("rows", "10");
    const rightFingerKeys = keys.filter(
      (key) => this.getPhysicalKey(key.id).boardId === "r-f"
    );
    rightFingerGrid.createKeys(this, rightFingerKeys);
    rightGridContainer.appendChild(rightFingerGrid);

    const rightThumbGrid = document.createElement("key-grid") as KeyGrid;
    rightThumbGrid.setAttribute("name", "ergodox-right-thumb");
    rightThumbGrid.setAttribute("cols", "6");
    rightThumbGrid.setAttribute("rows", "6");
    const rightThumbKeys = keys.filter(
      (key) => this.getPhysicalKey(key.id).boardId === "r-t"
    );
    rightThumbGrid.createKeys(this, rightThumbKeys);
    rightGridContainer.appendChild(rightThumbGrid);
  }
}
