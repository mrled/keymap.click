import { keyMaps, legendMaps } from "~/lib/keys";
import { drawDiagram } from "~/lib/diagram";

import "~/webcomponents/key-board-ergodox";
import "~/webcomponents/key-indicator";
import "~/webcomponents/key-info-nav-bar";

/* The UI of the keymap, including a keyboard, an info panel, and the canvas diagram.
 *
 * Some notes on naming:
 * KID is Keyboard, InfoPanel, Diamargs.
 * - The Keyboard is a <Keyboard> component.
 * - The InfoPanel is our <InfoPanel> component.
 * - Diamargs are diagram margins -- ¡¡Not CSS margins!!, but margins like a book has.
 *   They are narrow divs on either side of the Keyboard/InfoPanel reserved for diagram lines.
 *
 * The diagram lines are drawn from the Keyboard, to the InfoPanel, via the Diamargs.
 */
class KeyMapUI extends HTMLElement {
  constructor() {
    super();
    this.trackedElements = {};

    /* Listen for this event emitted by any child element.
     * (Make sure the child element emits it with bubbles: true so that we can catch it from any depth.)
     */
    this.addEventListener("key-selected", this.#handleKeySelected);
  }

  /* Run this code when the element is added to the DOM.
   * This might be before or after attributes are changed.
   * Run whether the element is created from HTML or from JavaScript.
   */
  connectedCallback() {
    // TODO: ensure this is a valid keyboard element name or do something that doesn't break execution if it's not
    const keyboardName = this.getAttribute("keyboard-element");
    const selectedKey = this.getAttribute("selected-key");
    const keyData = keyMaps.MrlMainLayer.allKeysById[selectedKey];

    const kidContainer = this.#makeTrackedChild("kidContainer", "div");
    kidContainer.className = "keymap-ui-kid-container";
    this.appendChild(kidContainer);

    const diamargLeft = this.#makeTrackedChild("diamargLeft", "div");
    diamargLeft.className = "keymap-ui-diamarg";

    const diamargRight = this.#makeTrackedChild("diamargRight", "div");
    diamargRight.className = "keymap-ui-diamarg";

    const centerPanel = this.#makeTrackedChild("centerPanel", "div");
    centerPanel.className = "keymap-ui-center-panel";

    const keyboard = this.#makeTrackedChild("keyboard", keyboardName);
    // TODO: don't hardcode keymaps/legendmaps
    // TODO: how can we allow the user to built their keyboard in HTML without calling createChildren?
    keyboard.createChildren({
      keymapName: "MrlMainLayer",
    });
    // TODO: What used to be onClickEach is now a global variable.
    //
    centerPanel.appendChild(keyboard);

    const keyInfoContainer = this.#makeTrackedChild("keyInfoContainer", "div");
    keyInfoContainer.className = "keymap-ui-keyinfo-container";

    const navBar = this.#makeTrackedChild("navBar", "key-info-nav-bar");
    navBar.setAttribute("key-id", selectedKey);
    keyInfoContainer.appendChild(navBar);

    const infoProse = this.#makeTrackedChild("infoProse", "div");
    infoProse.className = "key-info-prose";
    this.#setKeyInfoContent(keyData);
    keyInfoContainer.appendChild(infoProse);

    centerPanel.appendChild(keyInfoContainer);

    kidContainer.append(diamargLeft, centerPanel, diamargRight);

    const diagram = this.#makeTrackedChild("diagram", "canvas");
    diagram.className =
      "keyboard-diagram debug-border-orange debug-trans-bg-orange";
    this.appendChild(diagram);

    // A function that resizes the canvas to the size of the kidContainer
    this.resizeCanvas = () => {
      // console.log(
      //   `resizeCanvas() ${diagram.width}x${diagram.height} => ${kidContainer.offsetWidth}x${kidContainer.offsetHeight}`
      // );
      diagram.width = kidContainer.offsetWidth;
      diagram.height = kidContainer.offsetHeight;
    };
    // Call it once to set the initial size
    this.resizeCanvas();
    // Call it whenever the browser window is resized
    this.addEventListener("resize", this.resizeCanvas);
    // Call it whenever something other than browser window causes a resize --
    // e.g. if the element is resized by javascript or something
    this.resizeObserver = new ResizeObserver(this.resizeCanvas);
    this.resizeObserver.observe(kidContainer);
  }

  /* Call attributeChangedCallback when any of these attributes are changed from JavaScript
   * (changes to other attributes are ignored).
   */
  static get observedAttributes() {
    return ["keyboard-element", "selected-key"];
  }

  /* Run this code when an attribute is changed from JavaScript.
   * Does not run if an attribute is set when defined on the element in HTML.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    /* Create a new element if it doesn't exist, or return the existing one.
     * Track the element by name so we can work with it later.
     */

    switch (name) {
      case "keyboard-element":
        this.#updateKeyboard(newValue);
        break;
      case "selected-key":
        this.#updateSelectedKey(newValue);
        break;
      default:
        console.error(`KeyMapUI: Unhandled attribute: ${name}`);
        break;
    }
  }

  /* Handle a change to the keyboard-element attribute
   */
  #updateKeyboard(keyboardName) {
    // TODO: look up the keyboard name in some table somewhere and show an error if there is no match
    const newKeyboard = document.createElement(keyboardName);
    const oldKeyboard = this.trackedElements["keyboard"];
    this.trackedElements["keyboard"] = newKeyboard;
    newKeyboard.createChildren({
      keymapName: "MrlMainLayer",
      legendmapName: "MrlLegends",
    });

    // If the tracked elements don't exist, this hasn't been connected to the DOM yet.
    // The connectedCallback() will handle creating the elements and adding the keyboard to the DOM.
    const centerPanel = this.#makeTrackedChild("centerPanel", "div");
    if (centerPanel && oldKeyboard)
      centerPanel.replaceChild(newKeyboard, oldKeyboard);
    const navBar = this.#makeTrackedChild("navBar", "key-info-nav-bar");
    if (navBar) navBar.setAttribute("key-id", "");
  }

  /* Handle an external change to the selected-key attribute
   */
  #updateSelectedKey(selectedKey) {
    const keyData = keyMaps.MrlMainLayer.allKeysById[selectedKey];

    // Update the key in the key info navbar
    const navBar = this.#makeTrackedChild("navBar", "key-info-nav-bar");
    navBar.setAttribute("key-id", selectedKey);

    // Update the key info prose including descriptions etc.
    // Get all the key IDs that are targets of <key-indicator>s.
    const indicatedKeys = this.#setKeyInfoContent(keyData);

    // Update every key on the board
    // Make sure not to include the key in the nav bar which needs special handling
    const keyboard = this.trackedElements["keyboard"];
    const keyboardKeys = Array.from(
      keyboard.querySelectorAll("button", { is: "keyboard-key" })
    );
    keyboardKeys.forEach((key) => {
      const keyId = key.getAttribute("id");
      if (!keyId) {
        console.error(`KeyMapUI: Keyboard child key has no id: ${key}`);
        return;
      }
      const active = keyId === selectedKey;
      const inKeySelection =
        !active && keyData.selection && keyData.selection.indexOf(keyId) > -1;
      const indicatorTarget = indicatedKeys.indexOf(keyId) > -1;
      key.setAttribute("active", active);
      key.setAttribute("related-to-active", inKeySelection);
      key.setAttribute("target-of-indicator", indicatorTarget);
    });

    // drawDiagram(this.diagram, [], )
  }

  /* Set the key information content for the selected key
   * Return an array of key ids that are targets of <key-indicator>s.
   */
  #setKeyInfoContent(keyData) {
    const infoProse = this.#makeTrackedChild("infoProse", "div");
    while (infoProse.firstChild) {
      infoProse.removeChild(infoProse.firstChild);
    }
    if (keyData) {
      const h3 = document.createElement("h3");

      // TODO: don't hardcode keymaps/legendmaps
      const legendMap = legendMaps.MrlLegends;
      const keyMap = keyMaps.MrlMainLayer;

      let legend = legendMap[keyData.legend];
      if (!legend) {
        // This can happen for keys left blank
        // console.log(`No legend for keyData: ${keyData.legend}`);
        legend = {};
      }
      let textLabel = keyData.name;
      if (!textLabel) {
        if (legend.text) {
          textLabel = legend.text.value;
        } else if (legend.glyph) {
          textLabel = legend.glyph.value;
        }
      }

      h3.innerHTML = `The <kbd>${textLabel}</kbd> key`;
      infoProse.appendChild(h3);
      const keyIndicators = [];
      keyData.info.forEach((paragraph) => {
        const p = document.createElement("p");
        p.innerHTML = paragraph;
        const indicators = p.querySelectorAll("key-indicator");
        if (indicators.lenth > 0) window.whatever = indicators;
        Array.from(indicators).forEach((indicator) => {
          console.log(JSON.stringify(indicator));
          keyIndicators.push(indicator.getAttribute("id"));
        });
        infoProse.appendChild(p);
      });

      return keyIndicators;
    }
  }

  /* Handle a key being selected on the keyboard
   *
   * This is a custom event that is fired by <keyboard-key> elements.
   */
  #handleKeySelected(event) {
    // console.log(`KeyMapUI.#handleKeySelected(${event.detail})`);
    const keyId = event.detail;
    this.setAttribute("selected-key", keyId);
  }

  /* Create a new element if it doesn't exist, or return the existing one.
   */
  #makeTrackedChild(name, element) {
    if (!this.trackedElements[name]) {
      this.trackedElements[name] = document.createElement(element);
    }
    return this.trackedElements[name];
  }
}

if (!customElements.get("key-map-ui")) {
  customElements.define("key-map-ui", KeyMapUI);
}

export { KeyMapUI };
