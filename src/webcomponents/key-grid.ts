import { KeyMapKey } from "~/lib/keyMap";
import { KeyBoard } from "./key-board";
import { KeyboardKey } from "./keyboard-key";

/* KeyGrid: An HTML grid template for keyboard keys.
 *
 * A key grid is a sub-section of a keyboard.
 * Some keyboards might have just a single grid for the whole board.
 * An ErgoDox has a left finger grid, a left thumb cluster grid,
 * a right finger grid, and a right thumb cluster grid.
 *
 * Create child <keyboard-key> elements directly,
 * or use the createKeys() method to create them from key data.
 * When creating keys in HTML, you must create child <keyboard-key> elements
 * and set their attributes manually,
 * including setting an onclick function that emits a "key-selected" event.
 * When using createKeys(),
 * just pass in the list of key IDs and it will create the child elements for you
 * with the correct attributes and onclick functions.
 *
 * Attributes:
 *   name:                  The name of the grid, used for styling with key-grid[name=THISVALUE].
 *   cols:                  The number of columns in the grid
 *   rows:                  Number of rows in the grid
 */
export class KeyGrid extends HTMLElement {
  static get observedAttributes() {
    return ["name", "cols", "rows"];
  }

  constructor() {
    super();
  }

  /* Handle initial element creation
   */
  connectedCallback() {
    // Call attributeChangedCallback for each attribute to set initial state.
    const cols = this.getAttribute("cols") || "0";
    this.attributeChangedCallback("cols", "0", cols);
    const rows = this.getAttribute("rows") || "0";
    this.attributeChangedCallback("rows", "0", rows);
  }

  /* Handle attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "name":
        break;
      case "cols":
        const cols = parseInt(newValue, 10) || 0;
        this.style.gridTemplateColumns = `repeat(${cols}, var(--keyboard-grid-unit))`;
        break;
      case "rows":
        const rows = parseInt(newValue, 10) || 0;
        this.style.gridTemplateRows = `repeat(${rows}, var(--keyboard-grid-unit))`;
        break;
      default:
        console.error(`KeyGrid: Unhandled attribute: ${name}`);
    }
  }

  // TODO: do we need to cache these getters?

  /* Get all the child <keyboard-key> elements
   */
  get keyElements(): KeyboardKey[] {
    return Array.from(this.querySelectorAll("button"))
      .filter((b) => b.getAttribute("is") === "keyboard-key")
      .map((b) => b as KeyboardKey);
  }

  /* Get a list of all the key IDs of the child <keyboard-key> elements
   */
  get keyIds() {
    return this.keyElements
      .filter((elem) => elem.hasAttribute("id"))
      .map((elem) => elem.getAttribute("id"));
  }

  /* Remove all child keys.
   * Useful when working with this element programmatically.
   */
  removeAllChildren() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /* Create a single <keyboard-key> element from key data
   */
  #createKey(keyBoard: KeyBoard, key: KeyMapKey, idx: number) {
    // TODO: handle image legends
    let legendText = key.textLegend || key.name;
    let legendImage = "";

    const keyElement = document.createElement("button", { is: "keyboard-key" });

    const physicalKey = keyBoard.getPhysicalKey(key.id);

    // TODO: Should this really be necessary?
    // I would have guessed that setting { is: "keyboard-key" } above would have done this,
    // but my CSS targetting button[is="keyboard-key"] wasn't working until I added this line.
    keyElement.setAttribute("is", "keyboard-key");

    keyElement.setAttribute("position", physicalKey.positionAttribute);
    keyElement.setAttribute("legend-text", legendText);
    keyElement.setAttribute("legend-image", legendImage);
    keyElement.setAttribute("id", key.id);

    // If true, place the key handle in the top half of the key.
    //
    const keyHandleTop = idx % 2 === 0;
    keyElement.setAttribute("key-handle-top", keyHandleTop.toString());

    keyElement.onclick = () => {
      keyElement.dispatchEvent(
        new CustomEvent("key-selected", {
          bubbles: true,
          detail: key.id,
        })
      );
    };

    this.appendChild(keyElement);

    return keyElement;
  }

  /* Create <keyboard-key> elements from key data.
   *   keys:          List of KeyMapKey objects
   *   keyBoard:      A KeyBoard instance
   */
  createKeys(keyBoard: KeyBoard, keys: KeyMapKey[]) {
    this.removeAllChildren();
    keys.forEach((key: KeyMapKey, idx: number) => {
      this.#createKey(keyBoard, key, idx);
    });
  }
}
