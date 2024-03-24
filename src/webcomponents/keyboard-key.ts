/* A keyboard key
 * Properties of the web component:
 *   position:                  A string containing the size and starting location of the key,
 *                              in the format "xsize ysize xloc yloc",
 *                              like "2 2 0 0" for a 2x2 key that starts at the upper left corner of the grid.
 *                              The location may be "auto" for xloc/yloc,
 *                              which will let grid layout handle it.
 *                              Default: "2 2 auto auto".
 *                              (Note that the smallest key size is 2x2.)
 *   legend-text:               A string to use for the legend.
 *                              If it's a single character, it will be sized larger.
 *                              Four characters is the most that will fit on a 2x2 key.
 *   legend-image:              A file path to an image to use for the legend.
 *                              If this is set, it will override legend-text.
 *   standalone:                Return with classes for standalone rendering,
 *                              rather than the default which returns with classes for rendering in a grid
 *   id:                        Key id, for drawing diagram lines
 *   active:                    True if this key has been selected by the user
 *   related-to-active:         True if this key is a member of the same group as the key selected by the user
 *   target-of-indicator:       True if this key is the target of a diagram liner
 *   key-extra-classes:         Extra classes for the key (this element)
 *   key-handle-extra-classes:  Extra classes for the key handle (the child <key-handle> element)
 *   key-handle-top:            True if the key handle should be at the top of the key
 * Relevant properties of the superclass (HTMLButtonElement):
 *   onclick:                   An onClick function
 */
export class KeyboardKey extends HTMLButtonElement {
  legendTextNode: Text | null;
  legendImageElement: Element | null;
  keyHandleElement: Element | null;

  static get observedAttributes() {
    return [
      "position",
      "legend-text",
      "legend-image",
      "standalone",
      "id",
      "active",
      "related-to-active",
      "target-of-indicator",
      "key-extra-classes",
      "key-handle-extra-classes",
      "key-handle-top",
    ];
  }

  constructor() {
    super();
    this.legendTextNode = null;
    this.legendImageElement = null;
    this.keyHandleElement = null;
  }

  connectedCallback() {
    this.updateComponent();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateComponent();
  }

  updateComponent() {
    const position = this.getAttribute("position") || "";
    const standalone = this.getAttribute("standalone") !== null;
    const legendText = this.getAttribute("legend-text") || "";
    const legendImage = this.getAttribute("legend-image") || "";
    const id = this.getAttribute("id") || "";
    const extraClasses = this.getAttribute("key-extra-classes") || "";
    const keyHandleTop = this.getAttribute("key-handle-top") === "true";
    const keyHandleExtraClasses =
      this.getAttribute("key-handle-extra-classes") || "";

    // Parse the size and location of the key in the grid
    let [xsize, ysize, xloc, yloc] = position.split(" ");
    xsize = xsize || "2";
    ysize = ysize || "2";
    xloc = xloc || "auto";
    yloc = yloc || "auto";

    this.className = extraClasses;

    if (standalone) {
      // The style prop if this key is being rendered as a standalone key
      this.style.width = `calc(var(--keyboard-grid-unit) * ${xsize})`;
      this.style.height = `calc(var(--keyboard-grid-unit) * ${ysize})`;
      this.className += " standalone-key";
    } else {
      // The style prop if this key is being rendered in a grid
      this.style.gridColumnStart = xloc;
      this.style.gridRowStart = yloc;
      this.style.gridColumnEnd = `span ${xsize}`;
      this.style.gridRowEnd = `span ${ysize}`;
    }

    // We have to be careful how we set child nodes and child text elements.
    // We keep track of each element we add, so that we don't add it more than once.
    // We also avoid setting innerText directly, as that will remove all other child nodes.

    if (legendImage) {
      if (this.legendTextNode) {
        this.removeChild(this.legendTextNode);
        this.legendTextNode = null;
      }
      if (!this.legendImageElement) {
        this.legendImageElement = document.createElement("img");
        this.appendChild(this.legendImageElement);
      }
      this.legendImageElement.setAttribute("src", legendImage);
    } else {
      if (this.legendImageElement) {
        this.removeChild(this.legendImageElement);
        this.legendImageElement = null;
      }
      if (!this.legendTextNode) {
        this.legendTextNode = document.createTextNode(legendText);
        this.appendChild(this.legendTextNode);
      }
      this.legendTextNode.textContent = legendText;
      // TODO: can CSS change font size based on length of the string? Then we could remove these classes.
      if (legendText.length <= 2) {
        this.className += " legend-type-glyph";
      } else {
        this.className += " legend-type-text";
      }
    }

    if (!this.keyHandleElement) {
      this.keyHandleElement = document.createElement("key-handle");
      this.appendChild(this.keyHandleElement);
    }
    this.keyHandleElement.setAttribute("key-id", id);
    this.keyHandleElement.setAttribute("col-start", xloc);
    this.keyHandleElement.setAttribute("handle-top", keyHandleTop.toString());
    this.keyHandleElement.setAttribute("extra-classes", keyHandleExtraClasses);
  }
}