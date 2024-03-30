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
      // TODO: should we be zero indexed for the key positions?
      // The original version was one indexed, but that seems like a mistake.
      // However, I'm currently changing too many things to change that too --
      // among other things, it would require changing all the key indicators.
      // I'm going to define them as zero indexed and convert them inline to one indexed.
      // Later we can change everything to zero indexing in one step.
      const pointOneIndexed = (x: number, y: number) => new Point(x + 1, y + 1);

      this._physicalKeys = [
        // Left fingers, number row
        new PhysicalKey("l-f", pointOneIndexed(0, 0), new Size(3, 2)),
        new PhysicalKey("l-f", pointOneIndexed(3, 0), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(5, 0), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(7, 0), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(9, 0), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(11, 0), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(13, 0), new Size(2, 2)),
        // Left fingers, qwerty row
        new PhysicalKey("l-f", pointOneIndexed(0, 2), new Size(3, 2)),
        new PhysicalKey("l-f", pointOneIndexed(3, 2), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(5, 2), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(7, 2), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(9, 2), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(11, 2), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(13, 2), new Size(2, 3)),
        // Left fingers, asdf row
        new PhysicalKey("l-f", pointOneIndexed(0, 4), new Size(3, 2)),
        new PhysicalKey("l-f", pointOneIndexed(3, 4), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(5, 4), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(7, 4), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(9, 4), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(11, 4), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(13, 5), new Size(2, 3)),
        // Left fingers, zxcv row
        new PhysicalKey("l-f", pointOneIndexed(0, 6), new Size(3, 2)),
        new PhysicalKey("l-f", pointOneIndexed(3, 6), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(5, 6), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(7, 6), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(9, 6), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(11, 6), new Size(2, 2)),
        // Left fingers, bottom row
        new PhysicalKey("l-f", pointOneIndexed(1, 8), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(3, 8), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(5, 8), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(7, 8), new Size(2, 2)),
        new PhysicalKey("l-f", pointOneIndexed(9, 8), new Size(2, 2)),
        /* Left thumb
         *
         *       0 2 4
         *     +------+
         *   0 |   A B
         *   2 | C D E
         *   4 | C D F
         */
        new PhysicalKey("l-t", pointOneIndexed(2, 0), new Size(2, 2)), // A
        new PhysicalKey("l-t", pointOneIndexed(4, 0), new Size(2, 2)), // B
        new PhysicalKey("l-t", pointOneIndexed(0, 2), new Size(2, 4)), // C
        new PhysicalKey("l-t", pointOneIndexed(2, 2), new Size(2, 4)), // D
        new PhysicalKey("l-t", pointOneIndexed(4, 2), new Size(2, 2)), // E
        new PhysicalKey("l-t", pointOneIndexed(4, 4), new Size(2, 2)), // F
        // Right fingers, number row
        new PhysicalKey("r-f", pointOneIndexed(0, 0), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(2, 0), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(4, 0), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(6, 0), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(8, 0), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(10, 0), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(12, 0), new Size(3, 2)),
        // Right fingers, qwerty row
        new PhysicalKey("r-f", pointOneIndexed(0, 2), new Size(2, 3)),
        new PhysicalKey("r-f", pointOneIndexed(2, 2), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(4, 2), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(6, 2), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(8, 2), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(10, 2), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(12, 2), new Size(3, 2)),
        // Right fingers, asdf row
        new PhysicalKey("r-f", pointOneIndexed(0, 5), new Size(2, 3)),
        new PhysicalKey("r-f", pointOneIndexed(2, 4), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(4, 4), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(6, 4), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(8, 4), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(10, 4), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(12, 4), new Size(3, 2)),
        // Right fingers, zxcv row
        new PhysicalKey("r-f", pointOneIndexed(2, 6), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(4, 6), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(6, 6), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(8, 6), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(10, 6), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(12, 6), new Size(3, 2)),
        // Right fingers, bottom row
        new PhysicalKey("r-f", pointOneIndexed(4, 8), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(6, 8), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(8, 8), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(10, 8), new Size(2, 2)),
        new PhysicalKey("r-f", pointOneIndexed(12, 8), new Size(2, 2)),
        /* Right thumb
         *
         *       0 2 4
         *     +------+
         *   0 | A B
         *   2 | C D E
         *   4 | F D E
         */

        new PhysicalKey("r-t", pointOneIndexed(0, 0), new Size(2, 2)), // A
        new PhysicalKey("r-t", pointOneIndexed(2, 0), new Size(2, 2)), // B
        new PhysicalKey("r-t", pointOneIndexed(0, 2), new Size(2, 2)), // C
        new PhysicalKey("r-t", pointOneIndexed(2, 2), new Size(2, 4)), // D
        new PhysicalKey("r-t", pointOneIndexed(4, 2), new Size(2, 4)), // E
        new PhysicalKey("r-t", pointOneIndexed(0, 4), new Size(2, 2)), // F
      ];
    }
    return this._physicalKeys;
  }

  /* Create key-grid and keyboard-key elements from key data for this board.
   *
   * Use this method when defining this element programmatically.
   * (Not necessary if you want to just list all the child elements in HTML.
   *
   * Arguments:
   *   keymapName:    Name of the keymap to use, define in lib/keys.js
   *   legendmapName: Name of the legend map to use, defined in lib/keys.js
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
