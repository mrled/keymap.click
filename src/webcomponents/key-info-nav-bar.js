import { keyMaps, legendMaps } from "~/lib/keys";

import "~/webcomponents/key-grid";

/* Title bar for a key-info-panel
 *
 * TODO: Support guides
 */
class KeyInfoNavBar extends HTMLElement {
  static get observedAttributes() {
    return ["key-id"];
  }

  constructor() {
    super();
    this.trackedElements = {};
  }

  /* Create a new element if it doesn't exist, or return the existing one.
   * Track the element by name so we can work with it later.
   */
  #makeTrackedChild(name, element, options) {
    if (!this.trackedElements[name]) {
      this.trackedElements[name] = document.createElement(element, options);
    }
    return this.trackedElements[name];
  }

  connectedCallback() {
    const keyId = this.getAttribute("key-id");
    this.#updateKeyId(keyId);

    const titleGrid = this.#makeTrackedChild("titleGrid", "key-grid");
    titleGrid.setAttribute("name", "title-bar");
    // Use a constant size so that elements below/right of this one
    // don't change location when we select different keys
    titleGrid.setAttribute("cols", "3");
    titleGrid.setAttribute("rows", "4");
    // TODO: don't hard code keymaps/legendmaps
    titleGrid.setAttribute("legendmap-name", "MrlLegends");
    titleGrid.setAttribute("keymap-name", "MrlMainLayer");
    titleGrid.setAttribute("ignore-clicks", "true");

    const titleh2 = this.#makeTrackedChild("titleh2", "h2");
    this.append(titleGrid, titleh2);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "key-id":
        this.#updateKeyId(newValue);
        break;
      default:
        console.error(`KeyInfoNavBar: Unhandled attribute: ${name}`);
        break;
    }
  }

  #updateKeyId(keyId) {
    // TODO: don't hard code keymaps/legendmaps
    const key = keyId ? keyMaps.MrlMainLayer.allKeysById[keyId] : {};
    const modifiedTitleKeyId = "title-bar-0-0";
    const modifiedKeyData = Object.assign({}, key, {
      startPos: [0, 0],
      id: modifiedTitleKeyId,
    });
    const modifiedKeyMap = keyMaps.MrlMainLayer;
    modifiedKeyMap.allKeysById[modifiedTitleKeyId] = modifiedKeyData;

    const titleGrid = this.#makeTrackedChild("titleGrid", "key-grid");
    titleGrid.keyMap = modifiedKeyMap;
    titleGrid.setAttribute("selected-key", modifiedTitleKeyId); // Setting the selected key has to happen AFTER all the child keys are recreated
    titleGrid.createKeys([modifiedTitleKeyId]);

    const titleh2 = this.#makeTrackedChild("titleh2", "h2");
    titleh2.textContent = key ? "Key information" : "Welcome";
    this.appendChild(titleh2);
  }
}

if (!customElements.get("key-info-nav-bar")) {
  customElements.define("key-info-nav-bar", KeyInfoNavBar);
}

export { KeyInfoNavBar };
