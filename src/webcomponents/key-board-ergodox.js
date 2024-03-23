import { keyMaps } from "~/lib/keys";
import { KeyBoard } from "~/webcomponents/key-board";
import "~/webcomponents/key-grid";

/* An ErgoDox keyboard.
 *
 * Create child elements directly,
 * or use the createChildren() method to create them from state data.
 */
class KeyBoardErgodox extends KeyBoard {
  static get observedAttributes() {}

  constructor() {
    super();
  }

  connectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}

  /* Create key-grid and keyboard-key elements from key data for this board.
   *
   * Use this method when defining this element programmatically.
   * (Not necessary if you want to just list all the child elements in HTML.
   *
   * Arguments:
   *   keymapName:    Name of the keymap to use, define in lib/keys.js
   *   legendmapName: Name of the legend map to use, defined in lib/keys.js
   */
  createChildren({ keymapName }) {
    this.removeAllChildren();

    // TODO: the ErgoDox should define its OWN list of physical keys
    // which is independent of the keymap or the layer or whatever.
    // The keymaps and legendmaps should use these keys as identifiers for the keys.
    // That will make keyboards independent of keymaps/layers/legendmaps.
    const keys = keyMaps[keymapName];

    const leftSubBoard = document.createElement("div");
    leftSubBoard.className = "keyboard-sub-board keyboard-sub-board-left";
    this.appendChild(leftSubBoard);

    const leftTitle = document.createElement("h2");
    leftTitle.textContent = "Left hand";
    leftSubBoard.appendChild(leftTitle);

    const leftGridContainer = document.createElement("div");
    leftGridContainer.className = "keygrid-container";
    leftSubBoard.appendChild(leftGridContainer);

    const leftFingerGrid = document.createElement("key-grid");
    leftFingerGrid.setAttribute("name", "ergodox-left-finger");
    leftFingerGrid.setAttribute("cols", "15");
    leftFingerGrid.setAttribute("rows", "10");
    const leftHandKeyIds = keys.leftHandKeys.map((key) => key.id);
    leftFingerGrid.createKeys(leftHandKeyIds);
    leftGridContainer.appendChild(leftFingerGrid);

    const leftThumbGrid = document.createElement("key-grid");
    leftThumbGrid.setAttribute("name", "ergodox-left-thumb");
    leftThumbGrid.setAttribute("cols", "6");
    leftThumbGrid.setAttribute("rows", "6");
    const leftThumbKeyIds = keys.leftThumbKeys.map((key) => key.id);
    leftThumbGrid.createKeys(leftThumbKeyIds);
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

    const rightFingerGrid = document.createElement("key-grid");
    rightFingerGrid.setAttribute("name", "ergodox-right-finger");
    rightFingerGrid.setAttribute("cols", "15");
    rightFingerGrid.setAttribute("rows", "10");
    const rightHandKeyIds = keys.rightHandKeys.map((key) => key.id);
    rightFingerGrid.createKeys(rightHandKeyIds);
    rightGridContainer.appendChild(rightFingerGrid);

    const rightThumbGrid = document.createElement("key-grid");
    rightThumbGrid.setAttribute("name", "ergodox-right-thumb");
    rightThumbGrid.setAttribute("cols", "6");
    rightThumbGrid.setAttribute("rows", "6");
    const rightThumbKeyIds = keys.rightThumbKeys.map((key) => key.id);
    rightThumbGrid.createKeys(rightThumbKeyIds);
    rightGridContainer.appendChild(rightThumbGrid);
  }

  removeAllChildren() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }
}

if (!customElements.get("key-board-ergodox")) {
  customElements.define("key-board-ergodox", KeyBoardErgodox);
}

export { KeyBoardErgodox };
