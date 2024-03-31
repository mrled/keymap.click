import log from "loglevel";

import { KeyMapUIOptions } from "~/lib/KeyMapUIOptions";
import { ConnectionPair, KeyInfoConnectType } from "~/lib/keyConnections";
import { KeyMap } from "~/lib/keyMap";

import { KeyHandle } from "~/webcomponents/key-handle";
import { KeyIndicator } from "~/webcomponents/key-indicator";
import { KeyBoard } from "./key-board";
import { KeyInfoNavBar } from "~/webcomponents/key-info-nav-bar";
import { KeyMapUIDiagram } from "./key-map-ui-diagram";
import {
  IStateObserver,
  KeyMapUIState,
  KeyMapUIStateProvider,
} from "~/lib/KeyMapUIState";

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

export class KeyMapUI
  extends HTMLElement
  implements IStateObserver<KeyMapUIState> {
  //

  /* The ResizeObserver that watches for changes in the size of the kidContainer.
   */
  resizeObserver: ResizeObserver;

  /* The state.
   * This should not be set outside of the constructor
   * (but state.setState() can be used to set individual properties outside of the constructor).
   */
  private state: KeyMapUIStateProvider;

  constructor() {
    super();

    /* Set the state object that will be passed to all children.
     */
    this.state = new KeyMapUIStateProvider();
    this.state.setState("initialized", true);
    this.state.attach(this);

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

  update<KeyMapUIState>(
    key: keyof KeyMapUIState,
    oldValue: KeyMapUIState[keyof KeyMapUIState],
    newValue: KeyMapUIState[keyof KeyMapUIState]
  ) {
    if (!this.isConnected) {
      return;
    }
    switch (key) {
      case "debug":
        if ((newValue as number) > 0) {
          log.setLevel(log.levels.DEBUG);
        } else {
          log.setLevel(log.levels.INFO);
        }
        this.diagram.draw();
        break;
      case "keyboardElementName":
        this.#updateKeyboardElementName(newValue as string);
        break;
      case "keymapId":
        this.#updateKeyMapId(newValue as string);
        break;
      case "layer":
        this.#updateLayer(newValue as number);
        break;
      case "selectedKey":
        this.#updateSelectedKey(newValue as string);
        break;
      case "queryPrefix":
        this.#updateQueryPrefix(oldValue as string, newValue as string);
        break;
    }
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
      // First, try to find a keyboard in the DOM
      this._keyboard = this.querySelector("keyboard") as KeyBoard;
    }
    if (!this._keyboard) {
      const keyboardElementName = this.state.getState("keyboardElementName");
      let newElementName: string;
      if (keyboardElementName) {
        // Next, look for the keyboard element by name if it was set
        if (!customElements.get(keyboardElementName)) {
          throw new Error(
            `KeyMapUI: Keyboard element ${keyboardElementName} not found`
          );
        }
        newElementName = keyboardElementName;
      } else {
        // Finally, fall back to the default keyboard element name
        newElementName = "key-board-title-screen";
      }
      this._keyboard = document.createElement(newElementName) as KeyBoard;
    }
    return this._keyboard;
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

  private _diagram: KeyMapUIDiagram | null = null;
  get diagram(): KeyMapUIDiagram {
    if (!this._diagram) {
      this._diagram = this.querySelector("key-map-ui-diagram");
    }
    if (!this._diagram) {
      this._diagram = document.createElement(
        "key-map-ui-diagram"
      ) as KeyMapUIDiagram;
    }
    if (!this._diagram.readyToDraw) {
      this._diagram.centerPanel = this.centerPanel;
      this._diagram.diamargLeft = this.diamargLeft;
      this._diagram.diamargRight = this.diamargRight;
      this._diagram.infoProse = this.infoProse;
    }
    if (!this._diagram.state.getState("initialized")) {
      this._diagram.state = this.state;
      this._diagram.state.attach(this._diagram);
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

  private _keyboards: string[] = [];
  get keyboards(): string[] {
    return this._keyboards;
  }
  set keyboards(value: string[]) {
    this._keyboards = [];
    // For each keyboard element name we have just set,
    // add its blank keymap to our keymaps property.
    value.forEach((kbName) => {
      const kbElement = customElements.get(kbName);
      if (!kbElement) {
        return;
      }
      this._keyboards.push(kbName);
      this.#idempotentlyAddBlankKeyMap(kbName);
    });
  }

  get keyMap(): KeyMap {
    const keyMapId = this.state.getState("keymapId");
    const keyboard = this.state.getState("keyboardElementName");
    return (
      this.keymaps.get(keyboard)?.get(keyMapId) || this.keyboard.blankKeyMap
    );
  }

  /* A map of keymaps by their keyboard element name and unique ID.
   *
   * Some terminology:
   * - This is a Map (JS object) of Maps (JS objects) of KeyMaps (instances of KeyMap).
   * - Each Map (JS object) has key:value pairs.
   */
  private _keymaps: Map<string, Map<string, KeyMap>> = new Map();
  get keymaps(): Map<string, Map<string, KeyMap>> {
    return this._keymaps;
  }
  set keymaps(value: Map<string, Map<string, KeyMap>>) {
    this._keymaps = value;

    this.keyboards.forEach((kbName) =>
      this.#idempotentlyAddBlankKeyMap(kbName)
    );
  }

  /* Given a list of KeyMap instances, set the keymaps property.
   *
   * Users will call this method to tell the UI what keymaps are available.
   */
  setKeymaps(value: KeyMap[]) {
    const newKeyMaps = new Map<string, Map<string, KeyMap>>();
    value.forEach((keyMap) => {
      const kbName = keyMap.keyboardElementName;
      if (!newKeyMaps.has(kbName)) {
        newKeyMaps.set(kbName, new Map());
      }
      const boardKeyMaps = newKeyMaps.get(kbName)!;
      boardKeyMaps.set(keyMap.uniqueId, keyMap);
    });
    // Trigger the setter to update the keymaps property
    // so we don't have to duplicate the logic here
    this.keymaps = newKeyMaps;
  }

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

    this.state.setStateFromQueryString();
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

    // TODO: sync the state names with the element names for a better time
    switch (name) {
      case "debug":
        this.state.setState("debug", newValue === "true" ? 1 : 0);
        break;
      case "keyboard-element":
        this.state.setState("keyboardElementName", newValue);
        break;
      case "keymap-id":
        this.state.setState("keymapId", newValue);
        break;
      case "layer":
        this.state.setState("layer", parseInt(newValue, 10));
        break;
      case "selected-key":
        this.state.setState("selectedKey", newValue);
        break;
      case "query-prefix":
        this.state.setState("queryPrefix", newValue);
        break;
      default:
        console.error(`KeyMapUI: Unhandled attribute: ${name}`);
        break;
    }
  }

  //
  // Handle state changes
  //

  #updateKeyboardElementName(value: string) {
    if (!customElements.get(value)) {
      throw new Error(
        `KeyMapUI: Keyboard element "${value}" not found - has it been defined with customElements.define(), or if using a library, imported and registered?`
      );
    } else if (!this._keyboards.includes(value)) {
      throw new Error(
        `KeyMapUI: Keyboard element "${value}" not found in the list of available keyboards (${this._keyboards.join()})`
      );
    }
    const oldKeyboard = this._keyboard;
    this._keyboard = document.createElement(value) as KeyBoard;
    this.keyInfoNavBar.setAttribute("key-id", "");

    // Add the keyboard's blank map to our list of known keymaps
    if (!this.keymaps.has(value)) {
      this.keymaps.set(value, new Map());
    }
    const boardKeyMaps = this.keymaps.get(value)!;
    boardKeyMaps.set(
      this.keyboard.blankKeyMap.uniqueId,
      this.keyboard.blankKeyMap
    );

    // If the keymap-id attribute is set and is valid for the new keyboard, use it.
    // Otherwise, use the blank keymap for the new keyboard.
    const attribKeyMap = this.getAttribute("keymap-id") || "";
    if (attribKeyMap && boardKeyMaps.get(attribKeyMap)) {
      this.state.setState("keymapId", attribKeyMap);
      this._keyboard.createChildren(Array.from(this.keyMap.keys.values()));
    } else {
      this.state.setState("keymapId", this.keyboard.blankKeyMap.uniqueId);
      this._keyboard.createChildren(this.keyboard.blankKeyMapKeys);
    }

    // Replace the old keyboard with the new one in the DOM
    if (oldKeyboard && this.centerPanel.contains(oldKeyboard)) {
      this.centerPanel.replaceChild(this._keyboard, oldKeyboard);
    }

    this.layOutIdempotently();
    this.state.setQueryStringFromState(this);
  }

  /* Update the keymap ID
   */
  #updateKeyMapId(value: string) {
    const keyboard = this.state.getState("keyboardElementName");
    const newMap = this.keymaps.get(keyboard)?.get(value);
    if (!newMap) {
      console.error(
        `KeyMapUI: Key map "${value}" not found in available key maps`
      );
      return;
    }
    newMap.validateKeys();
    this.keyboard.createChildren(Array.from(this.keyMap.keys.values()));
    this.keyInfoNavBar.referenceKeyboard = this.keyboard;
    this.keyInfoNavBar.keyMap = this.keyMap;
    this.#showWelcomeMessage();
    this.state.setQueryStringFromState(this);
  }

  /* Update the layer
   */
  #updateLayer(value: number) {
    this.state.setQueryStringFromState(this);
  }

  /* Update the selected key
   */
  #updateSelectedKey(value: string) {
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

    // Clear any existing connections that back the diagram lines
    const connectionPairs: ConnectionPair[] = [];

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
        connectionPairs.push(
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
      connectionPairs.push(
        new ConnectionPair(indicator, indicated, KeyInfoConnectType.TextRef)
      );
    });

    this.state.setState("connectionPairs", connectionPairs);

    this.state.setQueryStringFromState(this);
    this.diagram.draw();
  }

  /* Update the query prefix and any query parameters that use it.
   */
  #updateQueryPrefix(oldValue: string, newValue: string) {
    this.#logCurrentStateAndQueryString(`#updateQueryPrefix() Top`);
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
  }

  //
  // Other private methods
  //

  /* Idempotently add a blank keymap to our set of known keymaps
   */
  #idempotentlyAddBlankKeyMap(kbName: string) {
    const kbElemConstructor = customElements.get(kbName);
    if (!kbElemConstructor) {
      return;
    }
    // TODO: this is a hack to get to instance properties, can I do something else?
    const tmpInstance = new kbElemConstructor() as KeyBoard;
    if (!this.keymaps.has(kbName)) {
      this.keymaps.set(kbName, new Map());
    }
    const boardKeyMaps = this.keymaps.get(kbName)!;
    const blankKeyMap = tmpInstance.blankKeyMap;
    boardKeyMaps.set(blankKeyMap.uniqueId, blankKeyMap);
  }

  /* Resize the canvas to the size of the kidContainer.
   */
  #resizeCanvas = () =>
    this.diagram.resize(
      this.kidContainer.offsetWidth,
      this.kidContainer.offsetHeight
    );

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
    // TODO: should we have the key set the state directly instead of doing it here?
    this.state.setState("selectedKey", keyId);
  }

  /* A helper function to show the current state and query string
   *
   * Reads the id attribute and prefixes its output with it, if it exists,
   * which can help to identify which element is logging.
   */
  #logCurrentStateAndQueryString(logPrefix: string) {
    const queryPrefix = this.state.getState("queryPrefix");
    if (!this.state.getState("debug")) {
      return;
    }

    const currentParams = new URLSearchParams(window.location.search);
    const qBoard = queryPrefix ? currentParams.get(`${queryPrefix}-board`) : "";
    const qMap = queryPrefix ? currentParams.get(`${queryPrefix}-map`) : "";
    const qLayer = queryPrefix ? currentParams.get(`${queryPrefix}-layer`) : "";
    const qKey = queryPrefix ? currentParams.get(`${queryPrefix}-key`) : "";

    const tBoardElement = this.state.getState("keyboardElementName");
    const tMap = this.state.getState("keymapId");
    const tLayer = this.state.getState("layer");
    const tKey = this.state.getState("selectedKey");

    const aPrefix = this.getAttribute("query-prefix") || "";
    const aBoardElement = this.getAttribute("keyboard-element") || "";
    const aMap = this.getAttribute("keymap-id") || "";
    const aLayer = parseInt(this.getAttribute("layer") || "0", 10);
    const aKey = this.getAttribute("selected-key") || "";

    const logTable = {
      state: {
        prefix: queryPrefix,
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

    const kmuiId = this.getAttribute("id") ? "#" + this.getAttribute("id") : "";

    console.log(
      `KeyMapUI${kmuiId}: ${logPrefix}: current raw query string: ${window.location.search}, current state:`
    );
    console.table(logTable);
  }
}
