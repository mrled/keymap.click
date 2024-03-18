import { drawDiagram } from "~/lib/diagram";
import { Connection } from "~/lib/keyConnections";
import { keyMaps, legendMaps } from "~/lib/keys";

import "~/webcomponents/key-board-ergodox";
import {KeyHandle} from "~/webcomponents/key-handle";
import {KeyIndicator} from "~/webcomponents/key-indicator";
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
  trackedElements:  {[key: string]: HTMLElement} ;
  resizeObserver: ResizeObserver;

  constructor() {
    super();
    this.trackedElements = {};


    /* Listen for changes to the size of the browser window,
     * and resize the canvas to match the size of the kidContainer.
     */
    this.addEventListener("resize", this.#resizeCanvas);

    /* Create a ResizeObserver that we will use later
     * to watch for changes in the size of the element that the canvas should completely cover
     */
    this.resizeObserver = new ResizeObserver(this.#resizeCanvas);

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
    const keyboardName = this.getAttribute("keyboard-element") || "";
    const selectedKey = this.getAttribute("selected-key") || "";
    // @ts-ignore
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
    // @ts-ignore
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

    // Resize the canvas to the size of the kidContainer for the first time
    this.#resizeCanvas();
    // Watch for changes in the size of the kidContainer
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
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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

  /* Resize the canvas to the size of the kidContainer.
   */
  #resizeCanvas = () => {
      // console.log(
      //   `resizeCanvas() ${diagram.width}x${diagram.height} => ${kidContainer.offsetWidth}x${kidContainer.offsetHeight}`
      // );
      const diagram = this.trackedElements["diagram"];
      const kidContainer = this.trackedElements["kidContainer"];
      if (!diagram || !kidContainer) {
        // These elements must not have been created yet
        return;
      }
      const diagramCanvas = diagram as HTMLCanvasElement;
      diagramCanvas.width = kidContainer.offsetWidth;
      diagramCanvas.height = kidContainer.offsetHeight;
    };


  /* Handle a change to the keyboard-element attribute
   */
  #updateKeyboard(keyboardName: string) {
    // TODO: look up the keyboard name in some table somewhere and show an error if there is no match
    const newKeyboard = document.createElement(keyboardName);
    const oldKeyboard = this.trackedElements["keyboard"];
    this.trackedElements["keyboard"] = newKeyboard;
    // @ts-ignore
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
  #updateSelectedKey(selectedKey: string) {
    // @ts-ignore
    const keyData = keyMaps.MrlMainLayer.allKeysById[selectedKey];

    // Connections to draw on the diagram
    const connections: Connection[] = [];

    // Update the key in the key info navbar
    const navBar = this.#makeTrackedChild("navBar", "key-info-nav-bar");
    navBar.setAttribute("key-id", selectedKey);
    const navBarHandle = navBar.querySelector("key-handle");

    // Update the key info prose including descriptions etc.
    // Get all the key IDs that are targets of <key-indicator>s.
    const proseKeyIndicators = this.#setKeyInfoContent(keyData);
    const indicatedKeyIds = proseKeyIndicators.map((indicator) =>
      indicator.getAttribute("id")
    );
    const indicatedElementsById: {[key: string]: KeyHandle} = {};

    // Update every key on the board
    // Make sure not to include the key in the nav bar which needs special handling
    const keyboard = this.trackedElements["keyboard"];

    // I can't seem to get JUST my custom button subclass from querySelectorAll...
    // Neither querySelectorAll('keyboard-key') nor
    // querySelectorAll('button', {is: 'keyboard-key'}) work.
    const keyboardKeys = Array.from(keyboard.querySelectorAll('button'))
      .filter(b => b.getAttribute("is") === "keyboard-key");

    console.log(`KeyMapUI: Found ${keyboardKeys.length} keys`);
    keyboardKeys.forEach((key) => {
      const keyId = key.getAttribute("id");
      if (!keyId) {
        console.error(`KeyMapUI: Keyboard child key has no id: ${key}`);
        return;
      }
      const active = keyId === selectedKey;
      const inKeySelection =
        !active && keyData.selection && keyData.selection.indexOf(keyId) > -1;
      const indicatorTarget = indicatedKeyIds.indexOf(keyId) > -1;
      key.setAttribute("active", active.toString());
      key.setAttribute("related-to-active", inKeySelection);
      key.setAttribute("target-of-indicator", indicatorTarget.toString());

      const keyHandle = key.querySelector("key-handle");
      if (!keyHandle) {
        console.log(`KeyMapUI: Key has no handle: ${keyId}`);
        return;
      }
      if (active) {
        // Make the connection from the navbar key to this key
        // console.log(`KeyMapUI: Found active key: ${keyId}`)
        connections.push(
          Connection.fromElements(navBarHandle, keyHandle, "selected")
        );
      } else if (indicatorTarget) {
        // Store the key handle for making a connection later
        // console.log(`KeyMapUI: Storing key handle for ${keyId}`);
        indicatedElementsById[keyId] = (keyHandle as KeyHandle);
      }
    });

    // Make connections from prose indicators to the keys they indicate.
    // Doing this here lets us ensure we are correct even in weird cases
    // like if a key is indicated by multiple indicators (untested).
    proseKeyIndicators.forEach((indicator) => {
      const indicatorId = indicator.getAttribute("id");
      if (!indicatorId) {
        console.error(`KeyMapUI: Key indicator has no id: ${indicator}`);
        return;
      }
      const indicated = indicatedElementsById[indicatorId];
      if (!indicated) {
        console.error(`KeyMapUI: Key indicator has no target: ${indicatorId}`);
        return;
      }
      connections.push(Connection.fromElements(indicator,indicated,"textref"));
    });

    drawDiagram(
      this.trackedElements["diagram"],
      connections,
      this.trackedElements["centerPanel"].getBoundingClientRect(),
      this.trackedElements["diamargLeft"].getBoundingClientRect(),
      this.trackedElements["diamargRight"].getBoundingClientRect(),
      this.trackedElements["infoProse"].getBoundingClientRect(),
      5
    );
  }

  /* Set the key information content for the selected key
   * Return an array of key ids that are targets of <key-indicator>s.
   */
  #setKeyInfoContent(keyData: any) {
    const infoProse = this.#makeTrackedChild("infoProse", "div");
    while (infoProse.firstChild) {
      infoProse.removeChild(infoProse.firstChild);
    }
      const keyIndicators: KeyIndicator[] = [];
    if (keyData) {
      const h3 = document.createElement("h3");

      // TODO: don't hardcode keymaps/legendmaps
      const legendMap = legendMaps.MrlLegends;
      const keyMap = keyMaps.MrlMainLayer;

      // @ts-ignore
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
      keyData.info.forEach((paragraph: string) => {
        const p = document.createElement("p");
        p.innerHTML = paragraph;
        const indicators = p.querySelectorAll("key-indicator");
        Array.from(indicators).forEach((indicator) =>
          keyIndicators.push(indicator as KeyIndicator)
        );
        infoProse.appendChild(p);
      });

    }
      return keyIndicators;
  }

  /* Handle a key being selected on the keyboard
   *
   * This is a custom event that is fired by <keyboard-key> elements.
   */
  #handleKeySelected(event: Event) {
    // console.log(`KeyMapUI.#handleKeySelected(${event.detail})`);
    const e = event as CustomEvent; // TODO: is there something nicer I can do instead?
    const keyId = e.detail;
    this.setAttribute("selected-key", keyId);
  }

  /* Create a new element if it doesn't exist, or return the existing one.
   */
  #makeTrackedChild(name: string, elementName: string): HTMLElement {
    if (!this.trackedElements[name]) {
      this.trackedElements[name] = document.createElement(elementName);
    }
    return this.trackedElements[name];
  }
}

if (!customElements.get("key-map-ui")) {
  customElements.define("key-map-ui", KeyMapUI);
}

export { KeyMapUI };
