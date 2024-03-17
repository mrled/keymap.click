import { keyMaps, legendMaps } from "~/lib/keys";
import "~/webcomponents/keyboard-key";

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
 *   keymap-name:           The name of the keymap to use
 *                          (keymap must be defined by this name in lib/keys.js `keyMaps` object)
 *   legendmap-name:        The name of the legend map to use
 *                          (legend map must be defined by this name in lib/keys.js `legendMaps` object)
 */
class KeyGrid extends HTMLElement {
  static get observedAttributes() {
    return ["name", "cols", "rows", "keymap-name", "legendmap-name"];
  }

  constructor() {
    super();
    this.keyData = {};
    // TODO: don't hard code these defaults here
    this.keyMap = keyMaps.MrlMainLayer;
    this.legendMap = legendMaps.MrlLegends;
  }

  /* Handle initial element creation
   */
  connectedCallback() {
    // Call attributeChangedCallback for each attribute to set initial state.
    this.attributeChangedCallback("cols", null, this.getAttribute("cols"));
    this.attributeChangedCallback("rows", null, this.getAttribute("rows"));
    const keymapName = this.getAttribute("keymap-name");
    this.keyMap = keyMaps[keymapName];
    const legendMapName = this.getAttribute("legendmap-name");
    this.legendMap = legendMaps[legendMapName];
  }

  /* Handle attribute changes
   */
  attributeChangedCallback(name, oldValue, newValue) {
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
      case "keymap-name":
        const newKeyMap = keyMaps[newValue];
        if (!newKeyMap) {
          console.error(`KeyGrid: No keymap found for ${newValue}`);
          break;
        }
        this.keyMap = newKeyMap;
        this.recreateKeys();
        break;
      case "legendmap-name":
        const newLegendMap = legendMaps[newValue];
        if (!newLegendMap) {
          console.error(`KeyGrid: No legendmap found for ${newValue}`);
          break;
        }
        this.legendMap = newLegendMap;
        this.recreateKeys();
        break;
      default:
        console.error(`KeyGrid: Unhandled attribute: ${name}`);
    }
  }

  // TODO: do we need to cache these getters?

  /* Get all the child <keyboard-key> elements
   */
  get keyElements() {
    return (
      Array.from(this.querySelectorAll("button", { is: "keyboard-key" })) || []
    );
  }

  /* Get a map of all the child <keyboard-key> elements by ID
   */
  get keyElementsById() {
    return this.keyElements.reduce((acc, elem) => {
      const elemId = elem.getAttribute("id");
      acc[elemId] = elem;
      return acc;
    }, {});
  }

  /* Get a list of all the key IDs of the child <keyboard-key> elements
   */
  get keyIds() {
    return this.keyElements.map((elem) => elem.getAttribute("id"));
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
  #createKey(keyId) {
    // TODO: get physical key layout from the keyboard, and don't set up legends here.
    // Instead, set up legends in the controller key-map-ui.
    if (!keyId || !this.keyMap || !this.keyMap.allKeysById[keyId]) {
      return;
    }
    const keyData = this.keyMap.allKeysById[keyId];
    const { size = [2, 2], startPos = ["auto", "auto"], legend } = keyData;
    const position = `${size[0]} ${size[1]} ${startPos[0]} ${startPos[1]}`;

    const legendData = this.legendMap[legend];
    let legendText = "";
    let legendImage = "";
    // TODO: don't differentiate between text and glyph here
    if (legendData && legendData.image) {
      legendImage = "legends/" + legendData.image.value;
    } else if (legendData && legendData.glyph) {
      if (Array.isArray(legendData.glyph.value)) {
        legendText = legendData.glyph.value.join("");
      } else {
        legendText = legendData.glyph.value;
      }
    } else if (legendData && legendData.text) {
      legendText = legendData.text.value;
    }

    const key = document.createElement("button", { is: "keyboard-key" });

    // TODO: Should this really be necessary?
    // I would have guessed that setting { is: "keyboard-key" } above would have done this,
    // but my CSS targetting button[is="keyboard-key"] wasn't working until I added this line.
    key.setAttribute("is", "keyboard-key");

    key.setAttribute("position", position);
    key.setAttribute("legend-text", legendText);
    key.setAttribute("legend-image", legendImage);
    key.setAttribute("id", keyData.id);
    // TODO: keyHandeExtraClasses is a hack, can we remove it?
    const keyHandleExtraClasses = keyData.keyHandleExtraClasses || "";
    key.setAttribute("key-handle-extra-classes", keyHandleExtraClasses);
    key.setAttribute("key-handle-top", keyData.keyHandleTop);

    key.onclick = () => {
      // console.log(`KeyGrid: Key ${keyData.id} clicked`);
      key.dispatchEvent(
        new CustomEvent("key-selected", { bubbles: true, detail: keyData.id })
      );
    };

    this.appendChild(key);

    this.keyData[keyData.id] = key;

    return key;
  }

  /* Create <keyboard-key> elements from key data.
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
  createKeys(keyIds) {
    this.removeAllChildren();
    keyIds.map((keyId) => this.#createKey(keyId));
  }

  /* Re-create keys after changing keymap or legendmap
   * First get a copy of all the key IDs from our existing children,
   * then remove all the children and create new ones from the key IDs.
   */
  recreateKeys() {
    const keyIds = this.keyIds;
    if (keyIds) {
      this.createKeys(keyIds);
    }
  }
}

if (!customElements.get("key-grid")) {
  customElements.define("key-grid", KeyGrid);
}

export { KeyGrid };
