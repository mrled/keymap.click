import { keyHandleDomIdFromKeyId } from "~/lib/keyConnections";

// TODO: should this be its own component, or just a part of keyboard-key ?

/* KeyHandle: a small element used as an anchor point to connect a diagram line to this key.
 *
 * We use this because it is transformed with the outer element,
 * for instance the thumb clusters are moved and rotated,
 * and this item is to relatively the same place within its parent <Key> during that transformation.
 *
 * The parent <Key> element is large enough that when it rotates, its BoundingClientRect is enlarged,
 * so the calculation we were doing before of a few px from the top left was actually outside of
 * the rotated <Key> element itself.
 *
 * Technically, this handle will have the same problem - its BoundingClientRect is enlarged.
 * However, it is so small that this doesn't matter.
 * The diagram line still looks good inside the <Key>.
 */
class KeyHandle extends HTMLElement {
  static get observedAttributes() {
    return ["key-id", "col-start", "handle-top", "extra-classes"];
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

  /* Retrieve attributes from the element.
   *
   * Check that all required attributes are passed, and return a normalized version of all of them.
   * (Sort of like a class constructor.)
   */
  retrieveAttributes() {
    const attributes = {
      keyId: this.getAttribute("key-id"),
      colStart: parseInt(this.getAttribute("col-start"), 10) || 0,
      handleTop: this.getAttribute("handle-top") === "true",
      extraClasses: this.getAttribute("extra-classes") || "",
    };
    return attributes;
  }

  updateComponent() {
    const {
      keyId,
      colStart,
      handleTop,
      extraClasses,
    } = this.retrieveAttributes();

    if (!keyId) {
      return;
    }

    // Set attributes and styles
    this.id = keyHandleDomIdFromKeyId(keyId); // Define this function or use a similar approach to generate the ID
    this.className = `key-handle ${extraClasses}`;
    const yOffset = this.calculateYOffset(colStart, handleTop);
    this.style.transform = `translateY(${yOffset}px)`;
    this.style.display = "";
  }

  /* Calculate an offset for the Y dimension.
   *
   * This offset is used to ensure that lines pointing to keys on the same row
   * don't overwrite each other.
   * It's not perfect, but it should be pretty good for non-pathological keymaps.
   */
  calculateYOffset(colStart, handleTop) {
    const yOffsetMultiplier = handleTop ? -1 : 1;
    const yOffset = colStart * yOffsetMultiplier;
    return yOffset;
  }
}

if (!customElements.get("key-handle")) {
  customElements.define("key-handle", KeyHandle);
}

export { KeyHandle };
