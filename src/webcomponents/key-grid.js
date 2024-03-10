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
 *
 * Attributes:
 *   name:                  The name of the grid; used internally but not displayed.
 *                          TODO: name attribute was used in React but may be removable now.
 *   cols:                  The number of columns in the grid
 *   rows:                  Number of rows in the grid
 */
class KeyGrid extends HTMLElement {
  static get observedAttributes() {
    return ["name", "cols", "rows"];
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

  updateComponent() {
    this.name = this.getAttribute("name");
    const cols = parseInt(this.getAttribute("cols"), 10) || 0;
    const rows = parseInt(this.getAttribute("rows"), 10) || 0;
    this.style.gridTemplateColumns = `repeat(${cols}, var(--keyboard-grid-unit))`;
    this.style.gridTemplateRows = `repeat(${rows}, var(--keyboard-grid-unit))`;
  }

  removeAllChildren() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /* Create a single <keyboard-key> element from key data
   */
  createKey(
    keyData,
    legends,
    onClickEach,
    targetKeyIds,
    pressedKey,
    keySelection
  ) {
    keyData = keyData || {};
    legends = legends || {};
    onClickEach = onClickEach || (() => {});
    targetKeyIds = targetKeyIds || [];
    pressedKey = pressedKey || "";
    keySelection = keySelection || [];
    window.whatever = keyData;
    // TODO: this requires that we rebuild the keyboard every time pressedKey changes
    // In a WebComponents world, that isn't the right way to do it.
    // Do something else instead.
    const isTargetKey = targetKeyIds.findIndex((id) => id === keyData.id) > -1;
    let isActive, isInSelectedGroup;
    if (pressedKey) {
      isActive = keyData.id === pressedKey.reactKey;
      isInSelectedGroup = !isActive && keySelection.indexOf(keyData.id) > -1;
    } else {
      isActive = false;
      isInSelectedGroup = false;
    }
    const { size = [2, 2], startPos = ["auto", "auto"], legend } = keyData;
    const position = `${size[0]} ${size[1]} ${startPos[0]} ${startPos[1]}`;
    const legendData = legends[legend];
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
    if (isActive) key.setAttribute("active", true);
    if (isInSelectedGroup) key.setAttribute("related-to-active", true);
    if (isTargetKey) key.setAttribute("target-of-indicator", true);
    // TODO: keyHandeExtraClasses is a hack, can we remove it?
    const keyHandleExtraClasses = keyData.keyHandleExtraClasses || "";
    key.setAttribute("key-handle-extra-classes", keyHandleExtraClasses);
    key.setAttribute("key-handle-top", keyData.keyHandleTop);
    key.onclick = () => onClickEach(keyData.id);
    this.appendChild(key);

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
  createKeys({
    keys,
    legends,
    onClickEach,
    targetKeyIds,
    pressedKey,
    keySelection,
  }) {
    this.removeAllChildren();
    keys.map((keyData) => {
      this.createKey(
        keyData,
        legends,
        onClickEach,
        targetKeyIds,
        pressedKey,
        keySelection
      );
    });
  }
}

if (!customElements.get("key-grid")) {
  customElements.define("key-grid", KeyGrid);
}

export { KeyGrid };
