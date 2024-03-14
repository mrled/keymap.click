import { KeyBoard } from "~/webcomponents/key-board";
import "~/webcomponents/key-grid";

/* An ErgoDox keyboard.
 *
 * Create child elements directly,
 * or use the createChildren() method to create them from state data.
 */
class KeyBoardErgodox extends KeyBoard {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.updateComponent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateComponent();
  }

  updateComponent() {}

  /* Create key-grid and keyboard-key elements from key data for this board.
   *
   * Use this method when defining this element programmatically.
   * (Not necessary if you want to just list all the child elements in HTML.
   *
   * Arguments:
   *   keyData:       List of key data objects (e.g. lib/keys.js)
   *   legends:       Legend map we are using
   *   onClickEach:   Optional function to call onClick for each <Key> component
   *                  It will be called with the key data object as the first argument
   *   pressedKey:    The ID of the key that is currently pressed, if any
   *   targetKeyIds:  The ID of keys that are targets of <key-indicator>s
   *   keySelection:  An array of key IDs that are part of a selection,
   *                  e.g. you might have the same text for all of home/end/pgup/pgdn
   *                  and you want to show them all as related when any one of them is pressed.
   */
  createChildren({
    keys,
    legends,
    onClickEach,
    targetKeyIds,
    pressedKey,
    keySelection,
  }) {
    console.log("KeyboardErgodox.createChildren()");
    this.removeAllChildren();
    if (!this.leftSubBoard) {
      this.leftSubBoard = document.createElement("div");
      this.leftSubBoard.className =
        "keyboard-sub-board keyboard-sub-board-left";
      this.appendChild(this.leftSubBoard);
    }
    if (!this.leftFingerGrid) {
      this.leftFingerGrid = document.createElement("key-grid");
      this.leftFingerGrid.setAttribute("gridName", "left finger");
      this.leftFingerGrid.setAttribute("cols", "15");
      this.leftFingerGrid.setAttribute("rows", "10");
      this.leftSubBoard.appendChild(this.leftFingerGrid);
    }
    this.leftFingerGrid.createKeys({
      keys: keys.keyMap.leftHandKeys,
      legends: legends,
      onClickEach: onClickEach,
      targetKeyIds: targetKeyIds,
      pressedKey: pressedKey,
      keySelection: keySelection,
    });
    if (!this.leftThumbGrid) {
      this.leftThumbGrid = document.createElement("key-grid");
      this.leftThumbGrid.setAttribute("gridName", "left thumb");
      this.leftThumbGrid.setAttribute("cols", "6");
      this.leftThumbGrid.setAttribute("rows", "6");
      this.leftSubBoard.appendChild(this.leftThumbGrid);
    }
    this.leftThumbGrid.createKeys({
      keys: keys.keyMap.leftThumbKeys,
      legends: legends,
      onClickEach: onClickEach,
      targetKeyIds: targetKeyIds,
      pressedKey: pressedKey,
      keySelection: keySelection,
    });
    if (!this.rightSubBoard) {
      this.rightSubBoard = document.createElement("div");
      this.rightSubBoard.className =
        "keyboard-sub-board keyboard-sub-board-right";
      this.appendChild(this.rightSubBoard);
    }
    if (!this.rightFingerGrid) {
      this.rightFingerGrid = document.createElement("key-grid");
      this.rightFingerGrid.setAttribute("gridName", "right finger");
      this.rightFingerGrid.setAttribute("cols", "15");
      this.rightFingerGrid.setAttribute("rows", "10");
      this.rightSubBoard.appendChild(this.rightFingerGrid);
    }
    this.rightFingerGrid.createKeys({
      keys: keys.keyMap.rightHandKeys,
      legends: legends,
      onClickEach: onClickEach,
      targetKeyIds: targetKeyIds,
      pressedKey: pressedKey,
      keySelection: keySelection,
    });
    if (!this.rightThumbGrid) {
      this.rightThumbGrid = document.createElement("key-grid");
      this.rightThumbGrid.setAttribute("gridName", "right thumb");
      this.rightThumbGrid.setAttribute("cols", "6");
      this.rightThumbGrid.setAttribute("rows", "6");
      this.rightSubBoard.appendChild(this.rightThumbGrid);
    }
    this.rightThumbGrid.createKeys({
      keys: keys.keyMap.rightThumbKeys,
      legends: legends,
      onClickEach: onClickEach,
      targetKeyIds: targetKeyIds,
      pressedKey: pressedKey,
      keySelection: keySelection,
    });
  }

  removeAllChildren() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }
}

if (!customElements.get("keyboard-ergodox")) {
  customElements.define("keyboard-ergodox", KeyBoardErgodox);
}

export { KeyBoardErgodox as KeyboardErgodox };
