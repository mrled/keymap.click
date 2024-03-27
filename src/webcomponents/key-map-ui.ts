import { drawDiagram } from "~/lib/diagram";
import { ConnectionPair, KeyInfoConnectType } from "~/lib/keyConnections";
import { KeyMap, KeyMapKey } from "~/lib/keyMap";

import { KeyHandle } from "~/webcomponents/key-handle";
import { KeyIndicator } from "~/webcomponents/key-indicator";
import { KeyBoard } from "./key-board";
import { KeyInfoNavBar } from "~/webcomponents/key-info-nav-bar";

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
 *
 * Keeping track of children:
 * - We use private properties with getters and optionally setters to keep track of child elements.
 *   These getters should search for the element in the DOM if it is not already stored --
 *   this is to allow for the element to be created from HTML or from JavaScript outside of this class.
 * - (TODO: check that this class works with child elements created from HTML.)
 * - Handle layout in one place: layOutIdempotently().
 *   Setters should .replaceChild() if appropriate, and always call layOutIdempotently() before returning.
 *   Handling layout in each individual get() method was too confusing.
 * - This means that layOutIdempotently() has to be called only in the connectedCallback() and in setters,
 *   and attributeChangedCallback() should only set the attribute and not call layOutIdempotently().
 */
export class KeyMapUI extends HTMLElement {
  /* The ResizeObserver that watches for changes in the size of the kidContainer.
   */
  resizeObserver: ResizeObserver;

  /* Connections to draw on the diagram
   */
  connectionPairs: ConnectionPair[] = [];

  constructor() {
    super();

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

  //
  // Getters and setters for child elements
  //

  private _keyInfoNavBar: KeyInfoNavBar | null = null;
  get keyInfoNavBar(): KeyInfoNavBar {
    if (!this._keyInfoNavBar) {
      this._keyInfoNavBar = this.querySelector(
        "key-info-nav-bar"
      ) as KeyInfoNavBar;
    }
    if (!this._keyInfoNavBar) {
      this._keyInfoNavBar = document.createElement(
        "key-info-nav-bar"
      ) as KeyInfoNavBar;
    }
    return this._keyInfoNavBar;
  }

  private _diamargLeft: HTMLElement | null = null;
  get diamargLeft(): HTMLElement {
    if (!this._diamargLeft) {
      this._diamargLeft = this.querySelector(".keymap-ui-diamarg");
    }
    if (!this._diamargLeft) {
      this._diamargLeft = document.createElement("div");
      this._diamargLeft.className = "keymap-ui-diamarg";
    }
    return this._diamargLeft;
  }

  private _diamargRight: HTMLElement | null = null;
  get diamargRight(): HTMLElement {
    if (!this._diamargRight) {
      this._diamargRight = this.querySelector(".keymap-ui-diamarg");
    }
    if (!this._diamargRight) {
      this._diamargRight = document.createElement("div");
      this._diamargRight.className = "keymap-ui-diamarg";
    }
    return this._diamargRight;
  }

  private _centerPanel: HTMLElement | null = null;
  get centerPanel(): HTMLElement {
    if (!this._centerPanel) {
      this._centerPanel = this.querySelector(".keymap-ui-center-panel");
    }
    if (!this._centerPanel) {
      this._centerPanel = document.createElement("div");
      this._centerPanel.className = "keymap-ui-center-panel";
    }
    return this._centerPanel;
  }

  private _kidContainer: HTMLElement | null = null;
  get kidContainer(): HTMLElement {
    if (!this._kidContainer) {
      this._kidContainer = this.querySelector(".keymap-ui-kid-container");
    }
    if (!this._kidContainer) {
      this._kidContainer = document.createElement("div");
      this._kidContainer.className = "keymap-ui-kid-container";
    }
    return this._kidContainer;
  }

  private _keyboard: KeyBoard | null = null;
  get keyboard(): KeyBoard {
    if (!this._keyboard) {
      this._keyboard = this.querySelector("keyboard") as KeyBoard;
    }
    if (!this._keyboard) {
      const keyboardName = this.getAttribute("keyboard-element") || "";
      if (keyboardName) {
        if (!customElements.get(keyboardName)) {
          throw new Error(
            `KeyMapUI: Keyboard element ${keyboardName} not found`
          );
        }
        this._keyboard = document.createElement(keyboardName) as KeyBoard;
      }
    }
    // TODO: have a generic default keyboard
    if (!this._keyboard) {
      this._keyboard = document.createElement("key-board-ergodox") as KeyBoard;
    }
    return this._keyboard;
  }
  set keyboard(value: KeyBoard) {
    const oldKeyboard = this._keyboard;
    this._keyboard = value;
    this.keyInfoNavBar.setAttribute("key-id", "");

    this.keyMap = this._keyboard.blankKeyMap;
    this._keyboard.createChildren(Array.from(this.keyMap.keys.values()));
    if (oldKeyboard) {
      this.centerPanel.replaceChild(this._keyboard, oldKeyboard);
    }
    this.layOutIdempotently();
  }

  private _infoContainer: HTMLElement | null = null;
  get infoContainer(): HTMLElement {
    if (!this._infoContainer) {
      this._infoContainer = this.querySelector(".keymap-ui-keyinfo-container");
    }
    if (!this._infoContainer) {
      this._infoContainer = document.createElement("div");
      this._infoContainer.className = "keymap-ui-keyinfo-container";
    }
    return this._infoContainer;
  }

  private _infoProse: HTMLElement | null = null;
  get infoProse(): HTMLElement {
    if (!this._infoProse) {
      this._infoProse = this.querySelector(".key-info-prose");
    }
    if (!this._infoProse) {
      this._infoProse = document.createElement("div");
      this._infoProse.className = "key-info-prose";
    }
    return this._infoProse;
  }

  private _diagram: HTMLCanvasElement | null = null;
  get diagram(): HTMLCanvasElement {
    if (!this._diagram) {
      this._diagram = this.querySelector("canvas");
    }
    if (!this._diagram) {
      this._diagram = document.createElement("canvas");
      this._diagram.className =
        "keyboard-diagram debug-border-orange debug-trans-bg-orange";
    }
    return this._diagram;
  }

  private _keyMap: KeyMap | null = null;
  get keyMap(): KeyMap {
    if (!this._keyMap) {
      this._keyMap = this.keyboard.blankKeyMap;
      if (!this._keyMap) {
        throw new Error("KeyMapUI: No key map found");
      }
    }
    return this._keyMap;
  }
  set keyMap(value: KeyMap) {
    this.keyMap.validateKeys(this.keyboard);
    this.keyboard.createChildren(Array.from(value.keys.values()));
    this.keyInfoNavBar.referenceKeyboard = this.keyboard;
    this.keyInfoNavBar.keyMap = value;
    this._keyMap = value;
  }

  /* Lay out all child components.
   *
   * Check if the child components are in the right place, and if not, move them.
   * This might be called a lot, so it should be fast and idempotent.
   */
  private layOutIdempotently() {
    // Direct children of this element
    // Note that because the diagram is last, it is drawn on top of the other elements,
    // which is what we want.
    if (![this.kidContainer, this.diagram].every((c) => this.contains(c))) {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      this.append(this.kidContainer, this.diagram);
    }

    // Children of the kid container
    if (
      ![
        this.diamargLeft,
        this.centerPanel,
        this.diamargRight,
      ].every((kcChild) => this.kidContainer.contains(kcChild))
    ) {
      while (this.kidContainer.firstChild) {
        this.kidContainer.removeChild(this.kidContainer.firstChild);
      }
      this.kidContainer.append(
        this.diamargLeft,
        this.centerPanel,
        this.diamargRight
      );
    }

    // children of the center panel
    if (
      ![this.keyboard, this.infoContainer].every((cpChild) =>
        this.centerPanel.contains(cpChild)
      )
    ) {
      while (this.centerPanel.firstChild) {
        this.centerPanel.removeChild(this.centerPanel.firstChild);
      }
      this.centerPanel.append(this.keyboard, this.infoContainer);
    }

    // children of the info container
    if (
      ![this.keyInfoNavBar, this.infoProse].every((icChild) =>
        this.infoContainer.contains(icChild)
      )
    ) {
      while (this.infoContainer.firstChild) {
        this.infoContainer.removeChild(this.infoContainer.firstChild);
      }
      this.infoContainer.append(this.keyInfoNavBar, this.infoProse);
    }
  }

  //
  // Lifecycle methods / callbacks
  //

  /* Run this code when the element is added to the DOM.
   * This might be before or after attributes are changed.
   * Run whether the element is created from HTML or from JavaScript.
   */
  connectedCallback() {
    this.layOutIdempotently();

    if (!this.keyMap) {
      this.keyMap = this.keyboard.blankKeyMap;
    }
    this.keyboard.createChildren(Array.from(this.keyMap.keys.values()));

    const selectedKey = this.getAttribute("selected-key") || "";
    this.keyInfoNavBar.setAttribute("key-id", selectedKey);
    if (selectedKey) {
      const keyData = this.keyMap.keys.get(selectedKey);
      if (keyData) {
        this.#setKeyInfoContent(keyData);
      } else {
        console.error(`KeyMapUI: Key ${selectedKey} not found in key map`);
      }
    }

    // Resize the canvas to the size of the kidContainer for the first time
    this.#resizeCanvas();
    // Watch for changes in the size of the kidContainer
    this.resizeObserver.observe(this.kidContainer);
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
    switch (name) {
      case "keyboard-element":
        if (!customElements.get(newValue)) {
          throw new Error(
            `KeyMapUI: Keyboard element ${newValue} not found - has it been defined with customElements.define(), or if using a library, imported and registered?`
          );
        } else {
          this.keyboard = document.createElement(newValue) as KeyBoard;
        }
        break;
      case "selected-key":
        this.#updateSelectedKey(newValue);
        break;
      default:
        console.error(`KeyMapUI: Unhandled attribute: ${name}`);
        break;
    }
  }

  //
  // Private methods
  //

  /* Resize the canvas to the size of the kidContainer.
   */
  #resizeCanvas = () => {
    this.diagram.width = this.kidContainer.offsetWidth;
    this.diagram.height = this.kidContainer.offsetHeight;
    this.#drawDiagram();
  };

  /* Handle an external change to the selected-key attribute
   */
  #updateSelectedKey(selectedKey: string) {
    const keyData = this.keyMap.keys.get(selectedKey);
    if (!keyData) {
      console.error(
        `KeyMapUI: Key ${selectedKey} not found in key map '${this.keyMap.name}'`
      );
      return;
    }

    // Clear any existing connections that back the diagram lines
    this.connectionPairs = [];

    // Update the key in the key info navbar
    this.keyInfoNavBar.setAttribute("key-id", selectedKey);
    const navBarHandle = this.keyInfoNavBar.querySelector("key-handle");

    // Update the key info prose including descriptions etc.
    // Get all the key IDs that are targets of <key-indicator>s.
    const proseKeyIndicators = this.#setKeyInfoContent(keyData);
    const indicatedKeyIds = proseKeyIndicators.map((indicator) =>
      indicator.getAttribute("id")
    );
    const indicatedElementsById: { [key: string]: KeyHandle } = {};

    // Update every key on the board
    // Make sure not to include the key in the nav bar which needs special handling

    const keyboardKeys = this.keyboard?.keyElements || [];

    keyboardKeys.forEach((key) => {
      const keyId = key.getAttribute("id");
      if (!keyId) {
        console.error(`KeyMapUI: Keyboard child key has no id: ${key}`);
        return;
      }
      const active = keyId === selectedKey;
      const keySelection = keyData.selection || [];
      const inKeySelection = !active && keySelection.indexOf(keyId) > -1;
      const indicatorTarget = indicatedKeyIds.indexOf(keyId) > -1;
      key.setAttribute("active", active.toString());
      key.setAttribute("related-to-active", inKeySelection.toString());
      key.setAttribute("target-of-indicator", indicatorTarget.toString());

      const keyHandle = key.querySelector("key-handle");
      if (!keyHandle) {
        return;
      }
      if (active && navBarHandle) {
        // Make the connection from the navbar key to this key
        this.connectionPairs.push(
          new ConnectionPair(
            navBarHandle,
            keyHandle,
            KeyInfoConnectType.Selected
          )
        );
      } else if (indicatorTarget) {
        // Store the key handle for making a connection later
        indicatedElementsById[keyId] = keyHandle as KeyHandle;
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
      this.connectionPairs.push(
        new ConnectionPair(indicator, indicated, KeyInfoConnectType.TextRef)
      );
    });

    this.#drawDiagram();
  }

  /* Draw the diagram lines connecting the keys to the info panel
   */
  #drawDiagram() {
    drawDiagram(
      this.diagram,
      this.connectionPairs.map((c) => c.connection),
      this.centerPanel.getBoundingClientRect(),
      this.diamargLeft.getBoundingClientRect(),
      this.diamargRight.getBoundingClientRect(),
      this.infoProse.getBoundingClientRect(),
      0 // TODO: set this debug parameter some better way
    );
  }

  /* Set the key information content for the selected key
   * Return an array of key ids that are targets of <key-indicator>s.
   */
  #setKeyInfoContent(key: KeyMapKey) {
    while (this.infoProse.firstChild) {
      this.infoProse.removeChild(this.infoProse.firstChild);
    }
    const keyIndicators: KeyIndicator[] = [];
    const h3 = document.createElement("h3");

    if (key.unset) {
      h3.innerHTML = `Unset key`;
    } else {
      h3.innerHTML = `The <kbd>${key.name}</kbd> key`;
    }
    this.infoProse.appendChild(h3);
    key.info.forEach((paragraph: string) => {
      const p = document.createElement("p");
      p.innerHTML = paragraph;
      const indicators = p.querySelectorAll("key-indicator");
      Array.from(indicators).forEach((indicator) =>
        keyIndicators.push(indicator as KeyIndicator)
      );
      this.infoProse.appendChild(p);
    });
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
}
