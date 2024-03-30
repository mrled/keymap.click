import log from "loglevel";

import { KeyMapUIOptions } from "~/lib/KeyMapUIOptions";
import { drawDiagram } from "~/lib/diagram";
import { ConnectionPair, KeyInfoConnectType } from "~/lib/keyConnections";
import { KeyMap } from "~/lib/keyMap";

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
 *
 * Attributes:
 * debug                Show debug information on the diagram and in the console.
 * keyboard-element     The name of the custom element to use as the keyboard.
 * selected-key         The id of the key that is selected.
 * query-prefix         A prefix for query parameters.
 *                      If set, the KeyMapUI will look for parameters in the URL query string with this prefix.
 *                      This attribute is not set by default,
 *                      so the KeyMapUI will not read from or write to the query string by default.
 *
 * Query string parameters:
 * board            The name of the custom element to use as the keyboard. (TODO: not implemented)
 * map              The name of one of the passed-in keymaps to use. (TODO: not implemented)
 * layer            The layer number to use. (TODO: not implemented)
 * id               The id of the key to select.
 *
 * Query string example:
 * 1. The KeyMapUI element is declared in the DOM as:
 *    <key-map-ui keyboard-element="key-board-ergodox" selected-key="l-f-1-1" query-prefix="kmui"></key-map-ui>
 * 2. The user loads the URL <https://example.com/>
 *    The query string is empty, so the KeyMapUI loads with the key-board-ergodox keyboard and the l-f-1-1 key selected.
 * 3. The user loads the URL <https://example.com/?kmui-board=example-board&kmui-map=mymap&kmui-layer=2&kmui-key=r-t-2-2>
 *    The KeyMapUI loads with the example-board keyboard, the mymap keymap, the layer number 2, and the r-t-2-2 key selected,
 *    overriding the keyboard-element and selected-key attributes set on the element in the DOM.
 * 4. When the user selects a key, or changes the board/map, the URL is updated with the new query parameters.
 */
export class KeyMapUI extends HTMLElement {
  /* The ResizeObserver that watches for changes in the size of the kidContainer.
   */
  resizeObserver: ResizeObserver;

  /* Connections to draw on the diagram
   */
  connectionPairs: ConnectionPair[] = [];

  /* Enable debug mode
   */
  enableDebug = false;

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
    if (!this._keyboard && this.keyboardElementName) {
      if (!customElements.get(this.keyboardElementName)) {
        throw new Error(
          `KeyMapUI: Keyboard element ${this.keyboardElementName} not found`
        );
      }
      this._keyboard = document.createElement(
        this.keyboardElementName
      ) as KeyBoard;
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

    this.availableKeyMaps = [];

    this._keyboard.createChildren(Array.from(this.keyMap.keys.values()));
    if (oldKeyboard && this.centerPanel.contains(oldKeyboard)) {
      this.centerPanel.replaceChild(this._keyboard, oldKeyboard);
    }
    this.layOutIdempotently();
    this.#setQueryStringFromState();
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
  // Other properties
  //

  private _keyboardElementName: string = "";
  get keyboardElementName(): string {
    return this._keyboardElementName;
  }
  set keyboardElementName(value: string) {
    if (!customElements.get(value)) {
      throw new Error(
        `KeyMapUI: Keyboard element "${value}" not found - has it been defined with customElements.define(), or if using a library, imported and registered?`
      );
    }
    if (this._keyboardElementName === value) {
      return;
    }
    this._keyboardElementName = value;
    this.keyboard = document.createElement(
      this._keyboardElementName
    ) as KeyBoard;
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

  private _keyMapName: string = "";
  get keyMapName(): string {
    return this._keyMapName;
  }
  set keyMapName(value: string) {
    const newMap = this.availableKeyMapsById.get(value);
    if (!newMap) {
      console.error(
        `KeyMapUI: Key map "${value}" not found in available key maps`
      );
      return;
    }
    newMap.validateKeys(this.keyboard);
    if (this._keyMapName === value) {
      return;
    }
    this._keyMap = newMap;
    this._keyMapName = value;
    this.keyboard.createChildren(Array.from(this.keyMap.keys.values()));
    this.keyInfoNavBar.referenceKeyboard = this.keyboard;
    this.keyInfoNavBar.keyMap = this.keyMap;
    this.#showWelcomeMessage();
    this.#setQueryStringFromState();
  }

  private _availableKeyMaps: KeyMap[] = [];
  get availableKeyMaps(): KeyMap[] {
    return this._availableKeyMaps;
  }
  set availableKeyMaps(value: KeyMap[]) {
    this._availableKeyMaps = value;
    if (!this._availableKeyMaps.includes(this.keyboard.blankKeyMap)) {
      this._availableKeyMaps.push(this.keyboard.blankKeyMap);
    }
    this._availableKeyMaps.forEach((keyMap) => {
      this._availableKeyMapsById.set(keyMap.uniqueId, keyMap);
    });
    if (!this.keyMapName || !this.availableKeyMapsById.has(this.keyMapName)) {
      this.keyMapName = this._availableKeyMaps[0].uniqueId;
    }
  }
  private _availableKeyMapsById: Map<string, KeyMap> = new Map();
  get availableKeyMapsById(): Map<string, KeyMap> {
    return this._availableKeyMapsById;
  }

  private _layer: number = 0;
  get layer(): number {
    return this._layer;
  }
  set layer(value: number) {
    this._layer = value;
    this.#setQueryStringFromState();
  }

  private _selectedKey: string = "";
  get selectedKey(): string {
    return this._selectedKey;
  }
  set selectedKey(value: string) {
    let keySelection: string[] = [];
    const indicatedElementsById: { [key: string]: KeyHandle } = {};
    let proseKeyIndicators: KeyIndicator[] = [];
    let indicatedKeyIds: string[] = [];

    if (value) {
      const keyData = this.keyMap.keys.get(value);
      if (!keyData) {
        console.error(
          `KeyMapUI: Key ${value} not found in key map '${this.keyMap.uniqueId}'`
        );
        return;
      }
      keySelection = keyData.selection || [];
      // Update the key info prose including descriptions etc.
      // Get all the key IDs that are targets of <key-indicator>s.
      proseKeyIndicators = this.#setKeyInfoContent(
        keyData.name,
        keyData.unset || false,
        keyData.info
      );
      indicatedKeyIds = proseKeyIndicators.map(
        (indicator) => indicator.getAttribute("id") || ""
      );
    } else {
      keySelection = [];
      this.#showWelcomeMessage();
    }

    this._selectedKey = value;

    // Clear any existing connections that back the diagram lines
    this.connectionPairs = [];

    // Update the key in the key info navbar
    this.keyInfoNavBar.setAttribute("key-id", value);
    const navBarHandle = this.keyInfoNavBar.querySelector("key-handle");

    // Update every key on the board
    // Make sure not to include the key in the nav bar which needs special handling

    const keyboardKeys = this.keyboard?.keyElements || [];

    keyboardKeys.forEach((key) => {
      const keyId = key.getAttribute("id");
      if (!keyId) {
        console.error(`KeyMapUI: Keyboard child key has no id: ${key}`);
        return;
      }
      const active = keyId === value;
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

    this.#setQueryStringFromState();
    this.#drawDiagram();
  }

  private queryPrefix = "";

  //
  // Lifecycle methods / callbacks
  //

  /* Run this code when the element is added to the DOM.
   * This might be before or after attributes are changed.
   * Run whether the element is created from HTML or from JavaScript.
   */
  connectedCallback() {
    this.#logCurrentStateAndQueryString("connectedCallback(): Top");
    // Set debugging stuff first, which does not rely on query parameters
    const debug = this.getAttribute("debug") || "false";
    this.attributeChangedCallback("debug", "", debug);

    // Then read the keyboard, keymap, layer, and selected key.
    // Unless overridden by the query parameters, these will be set to the attributes on the element.
    const keyboardElement = this.getAttribute("keyboard-element") || "";
    this.attributeChangedCallback("keyboard-element", "", keyboardElement);
    this.#logCurrentStateAndQueryString(
      "connectedCallback(): Just set keyboard element"
    );

    const keyMapName = this.getAttribute("keymap-id") || "";
    this.attributeChangedCallback("keymap-id", "", keyMapName);
    this.#logCurrentStateAndQueryString(
      "connectedCallback(): Just set keymap id"
    );

    const layer = this.getAttribute("layer") || "";
    this.attributeChangedCallback("layer", "", layer);
    this.#logCurrentStateAndQueryString("connectedCallback(): Just set layer");

    const selectedKey = this.getAttribute("selected-key") || "";
    this.attributeChangedCallback("selected-key", "", selectedKey);
    this.#logCurrentStateAndQueryString(
      "connectedCallback(): Just set selected key"
    );

    // Then set the query prefix, which determines which query parameters we read.
    // Its attributeChangedCallback will read the query string and update the state.
    const queryPrefix = this.getAttribute("query-prefix") || "";
    this.attributeChangedCallback("query-prefix", "", queryPrefix);
    this.#logCurrentStateAndQueryString(
      "connectedCallback(): Just set query prefix"
    );

    this.#setStateFromQueryString();
    this.layOutIdempotently();

    // Resize the canvas to the size of the kidContainer for the first time
    this.#resizeCanvas();
    // Watch for changes in the size of the kidContainer
    this.resizeObserver.observe(this.kidContainer);
  }

  /* Call attributeChangedCallback when any of these attributes are changed from JavaScript
   * (changes to other attributes are ignored).
   */
  static get observedAttributes() {
    return [
      "debug",
      "keyboard-element",
      "keymap-id",
      "layer",
      "query-prefix",
      "selected-key",
    ];
  }

  /* Run this code when an attribute is changed from JavaScript.
   * Does not run if an attribute is set when defined on the element in HTML.
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Don't do anything if we're not connected to the DOM.
    // This function is called by connectedCallback() for each attribute anyway,
    // and that function uses a specific order to set the internal properties correctly.
    if (!this.isConnected) {
      return;
    }

    switch (name) {
      case "debug":
        if (newValue === "true") {
          this.enableDebug = true;
          log.setLevel(log.levels.DEBUG);
        } else {
          this.enableDebug = false;
          log.setLevel(log.levels.INFO);
        }
        this.#drawDiagram();
        break;
      case "keyboard-element":
        this.keyboardElementName = newValue;
        break;
      case "keymap-id":
        this.keyMapName = newValue;
        break;
      case "layer":
        this.layer = parseInt(newValue, 10);
        break;
      case "query-prefix":
        this.#updateQueryPrefix(oldValue, newValue);
        break;
      case "selected-key":
        this.selectedKey = newValue;
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

  /* Read the query string and update the state of the KeyMapUI.
   */
  #setStateFromQueryString() {
    if (!this.queryPrefix) {
      return;
    }
    const currentParams = new URLSearchParams(window.location.search);

    const qBoard = currentParams.get(`${this.queryPrefix}-board`);
    const qMap = currentParams.get(`${this.queryPrefix}-map`);
    const qLayer = currentParams.get(`${this.queryPrefix}-layer`);
    const qKey = currentParams.get(`${this.queryPrefix}-key`);

    if (qBoard) {
      this.keyboardElementName = qBoard;
      // TODO: when we set it this way, and the map is also set in the query string, do we need to wait for the attributeChangedCallback to run before we can continue? How?
    }

    if (qMap) {
      const selectedMap = this.availableKeyMapsById.get(qMap);
      if (selectedMap) {
        this.keyMapName = qMap;
      } else {
        console.error(
          `KeyMapUI: Key map ${qMap} not found in available key maps`
        );
      }
    }

    if (qLayer) {
      this.layer = parseInt(qLayer, 10);
    }

    if (qKey) {
      this.selectedKey = qKey;
    }
  }

  /* Update the query prefix and any query parameters that use it.
   */
  #updateQueryPrefix(oldValue: string, newValue: string) {
    this.#logCurrentStateAndQueryString(`#updateQueryPrefix() Top`);
    this.queryPrefix = newValue;
    this.#logCurrentStateAndQueryString(
      `#updateQueryPrefix() One Down From Top`
    );
    if (oldValue) {
      // Remove all old query parameters with the old prefix
      const [params, newQs] = KeyMapUIOptions.parseQueryString(
        oldValue,
        window.location.search
      );
      const newUrl = params.any
        ? `${window.location.pathname}?${newQs.toString()}`
        : `${window.location.pathname}`;
      window.history.replaceState({}, "", newUrl);
      this.#logCurrentStateAndQueryString(
        `#updateQueryPrefix() After modifying the old parameters`
      );
    } else {
      this.#logCurrentStateAndQueryString(
        `#updateQueryPrefix() No old query prefix`
      );
    }
    // Re-sync the query parameters with the new prefix
    // this.#setQueryStringFromState();
  }

  /* Set the query string based on the current state.
   *
   * This is called whenever one of the queryable attributes changes.
   * It does not affect any query parameters other than those with the query prefix.
   *
   * If any of the query parameters match the attributes on the element in the DOM,
   * they are removed from the query string.
   * This means the query string overrides the attributes on the element,
   * and the URL isn't cluttered with unnecessary query parameters.
   *
   * This function doesn't handle changes to the query prefix itself;
   * that is handled by #updateQueryPrefix().
   */
  #setQueryStringFromState() {
    if (!this.queryPrefix) {
      return;
    }
    if (!this.isConnected) {
      return;
    }
    const newParams = new URLSearchParams(window.location.search);

    const tBoardElement = this.keyboardElementName;
    const tMap = this.keyMapName;
    const tLayer = this.layer;
    const tKey = this.selectedKey;

    const aBoardElement = this.getAttribute("keyboard-element") || "";
    const aMap = this.getAttribute("keymap-id") || "";
    const aLayer = parseInt(this.getAttribute("layer") || "0", 10);
    const aKey = this.getAttribute("selected-key") || "";

    if (tBoardElement && aBoardElement !== tBoardElement) {
      newParams.set(`${this.queryPrefix}-board`, tBoardElement);
    } else {
      newParams.delete(`${this.queryPrefix}-board`);
    }

    if (tMap && aMap !== tMap) {
      newParams.set(`${this.queryPrefix}-map`, tMap);
    } else {
      newParams.delete(`${this.queryPrefix}-map`);
    }

    if (tLayer && aLayer !== tLayer) {
      newParams.set(`${this.queryPrefix}-layer`, tLayer.toString());
    } else {
      newParams.delete(`${this.queryPrefix}-layer`);
    }

    if (tKey && aKey !== tKey) {
      newParams.set(`${this.queryPrefix}-key`, tKey);
    } else {
      newParams.delete(`${this.queryPrefix}-key`);
    }

    const newUrl =
      newParams.toString() !== ""
        ? `${window.location.pathname}?${newParams.toString()}`
        : `${window.location.pathname}`;

    if (window.location.search !== `?${newUrl}`) {
      window.history.replaceState({}, "", newUrl);
    }
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
      this.enableDebug
    );
  }

  /* Set the key information content for the selected key
   * Return an array of key ids that are targets of <key-indicator>s.
   */
  #setKeyInfoContent(name: string, unset: boolean, info: string[]) {
    while (this.infoProse.firstChild) {
      this.infoProse.removeChild(this.infoProse.firstChild);
    }
    const keyIndicators: KeyIndicator[] = [];
    const h3 = document.createElement("h3");

    if (unset) {
      h3.innerHTML = `Unset key`;
    } else {
      h3.innerHTML = `The <kbd>${name}</kbd> key`;
    }
    this.infoProse.appendChild(h3);
    info.forEach((paragraph: string) => {
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

  /* Show the welcome message for the keymap
   */
  #showWelcomeMessage() {
    while (this.infoProse.firstChild) {
      this.infoProse.removeChild(this.infoProse.firstChild);
    }
    this.keyMap.welcome.forEach((paragraph: string) => {
      const p = document.createElement("p");
      p.innerHTML = paragraph;
      this.infoProse.appendChild(p);
    });
  }

  /* Handle a key being selected on the keyboard
   *
   * This is a custom event that is fired by <keyboard-key> elements.
   */
  #handleKeySelected(event: Event) {
    const e = event as CustomEvent; // TODO: is there something nicer I can do instead?
    const keyId = e.detail;
    this.selectedKey = keyId;
  }

  /* A helper function to show the current state and query string
   */
  #logCurrentStateAndQueryString(logPrefix: string) {
    if (!this.enableDebug) {
      return;
    }

    const currentParams = new URLSearchParams(window.location.search);
    const qBoard = currentParams.get(`${this.queryPrefix}-board`);
    const qMap = currentParams.get(`${this.queryPrefix}-map`);
    const qLayer = currentParams.get(`${this.queryPrefix}-layer`);
    const qKey = currentParams.get(`${this.queryPrefix}-key`);

    const tPrefix = this.queryPrefix;
    const tBoardElement = this.keyboardElementName;
    const tMap = this.keyMapName;
    const tLayer = this.layer;
    const tKey = this.selectedKey;

    const aPrefix = this.getAttribute("query-prefix") || "";
    const aBoardElement = this.getAttribute("keyboard-element") || "";
    const aMap = this.getAttribute("keymap-id") || "";
    const aLayer = parseInt(this.getAttribute("layer") || "0", 10);
    const aKey = this.getAttribute("selected-key") || "";

    const logTable = {
      state: {
        prefix: tPrefix,
        board: tBoardElement,
        map: tMap,
        layer: tLayer,
        key: tKey,
      },
      attribute: {
        prefix: aPrefix,
        board: aBoardElement,
        map: aMap,
        layer: aLayer,
        key: aKey,
      },
      queryString: {
        prefix: "N/A",
        board: qBoard,
        map: qMap,
        layer: qLayer,
        key: qKey,
      },
    };

    console.log(
      `${logPrefix}: current raw query string: ${window.location.search}, current state:`
    );
    console.table(logTable);
  }
}
