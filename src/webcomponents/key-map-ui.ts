import log from "loglevel";

import { KeyMapUIOptions } from "~/lib/KeyMapUIOptions";
import { ConnectionPair, KeyInfoConnectType } from "~/lib/keyConnections";
import { KeyMap, KeyMapLayer } from "~/lib/keyMap";

import { KeyHandle } from "~/webcomponents/key-handle";
import { KeyIndicator } from "~/webcomponents/key-indicator";
import { KeyBoard } from "./key-board";
import { KeyInfoNavBar } from "~/webcomponents/key-info-nav-bar";
import { KeyMapUIDiagram } from "./key-map-ui-diagram";
import {
  KeyMapUIState,
  KeyMapUIStateChange,
  KeyMapUIStateChangeMap,
} from "~/lib/KeyMapUIState";
import { IStateObserver } from "~/lib/State";
import {
  setQueryStringFromState,
  setStateFromQsAndAttrib,
} from "~/lib/QueryStringState";
import { KeyBoardModel } from "~/lib/KeyboardModel";
import { KeyMapUIControls } from "./key-map-ui-controls";

// Import CSS files as inline strings.
// Vite supports the ?inline query parameter to load a file as a string;
// esbuild doesn't require that parameter but does work if it's there.
import varsStyleStr from "~/styles/vars.css?inline";
import rootStyleStr from "~/styles/root.css?inline";
import diagramStyleStr from "~/styles/diagram.css?inline";
import keygridStyleStr from "~/styles/keygrid.css?inline";
import keyInfoPanelStyleStr from "~/styles/keyInfoPanel.css?inline";

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
 * show-debug           Show checkbox to display debug information on the diagram and in the console.
 * keyboard-element     The name of the custom element to use as the keyboard.
 * keymap-id            The name of one of the passed-in keymaps to use.
 * layer                The layer number to use.
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

  /* The shadow DOM for us and all descendents.
   */
  shadow = this.attachShadow({ mode: "open" });
  // shadow = this;

  /* The ResizeObserver that watches for changes in the size of the kidContainer.
   */
  resizeObserver: ResizeObserver;

  /* The state.
   * This should not be set outside of the constructor
   * (but state.setState() can be used to set individual properties outside of the constructor).
   */
  private state: KeyMapUIState;

  constructor() {
    super();

    /* Set the state object that will be passed to all children.
     */
    this.state = new KeyMapUIState();
    this.state.initialized = true;
    this.state.attach(this);

    /* Listen for changes to the size of the browser window,
     * and resize the canvas to match the size of the kidContainer.
     */
    this.addEventListener("resize", () => this.#resizeCanvas);

    /* Create a ResizeObserver that we will use later
     * to watch for changes in the size of the element that the canvas should completely cover
     */
    this.resizeObserver = new ResizeObserver(() =>
      this.#resizeCanvas(this.state)
    );

    /* Listen for this event emitted by any child element.
     * (Make sure the child element emits it with bubbles: true so that we can catch it from any depth.)
     */
    this.addEventListener("key-selected", this.#handleKeySelected);
  }

  //
  // #region Public API methods
  //

  /* Given a list of KeyMap instances, set the keymaps state property.
   *
   * Users will call this method to tell the UI what keymaps are available.
   */
  addKeymaps(value: KeyMap[]) {
    const newKeymaps = new Map<string, Map<string, KeyMap>>();
    this.state.keymaps.forEach((value, key) => {
      newKeymaps.set(key, value);
    });
    value.forEach((keyMap) => {
      const kbName = keyMap.model.keyboardElementName;
      if (!newKeymaps.has(kbName)) {
        newKeymaps.set(kbName, new Map());
      }
      const boardKeyMaps = newKeymaps.get(kbName)!;
      boardKeyMaps.set(keyMap.uniqueId, keyMap);
    });
    this.state.keymaps = newKeymaps;
  }

  /* Set the kbModels state property.
   */
  addKbModels(value: KeyBoardModel[]) {
    this.state.kbModels = [...this.state.kbModels, ...value];
  }

  // #endregion

  //
  // #region Lifecycle methods / callbacks
  //

  /* Run this code when the element is added to the DOM.
   * This might be before or after attributes are changed.
   * Run whether the element is created from HTML or from JavaScript.
   */
  connectedCallback() {
    // The show-debug attribute doesn't set debug level in the state,
    // just whether the debug checkbox is shown.
    // It's not part of the query string stuff.
    const showDebug = this.getAttribute("show-debug") || "false";
    this.controls.setAttribute("show-debug", showDebug);

    // Set the initial state from the query string and attributes
    setStateFromQsAndAttrib({
      state: this.state,
      kmui: this,
    });

    this.layOutIdempotently();

    // Resize the canvas to the size of the kidContainer for the first time
    this.#resizeCanvas(this.state);
    // Watch for changes in the size of the kidContainer
    this.resizeObserver.observe(this.kidContainer);
  }

  /* Call attributeChangedCallback when any of these attributes are changed from JavaScript
   * (changes to other attributes are ignored).
   */
  static get observedAttributes() {
    return [
      "show-debug",
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
      case "show-debug":
        this.controls.setAttribute("show-debug", newValue);
        break;
      case "keyboard-element":
        this.state.setStatesByIds({
          keyboardElementName: newValue,
        });
        break;
      case "keymap-id":
        this.state.setStatesByIds({
          keymapId: newValue,
        });
        break;
      case "layer":
        this.state.setStatesByIds({
          layerIdx: parseInt(newValue, 10) || 0,
        });
        break;
      case "selected-key":
        this.state.setStatesByIds({
          selectedKey: newValue,
        });
        break;
      case "query-prefix":
        this.state.queryPrefix = newValue;
        break;
      default:
        console.error(`KeyMapUI: Unhandled attribute: ${name}`);
        break;
    }

    // setQueryStringFromState(this.state, this);
  }

  // #endregion

  //
  // #region Getters and setters for child elements
  //

  private _styling: HTMLStyleElement | null = null;
  get styling(): HTMLStyleElement {
    if (!this._styling) {
      this._styling = this.shadow.querySelector("style");
    }
    if (!this._styling) {
      this._styling = document.createElement("style");
      // Concatenate all the CSS strings into one string and place it in a <style> element.
      // This is kind of an annoying hack because bundling is awful.
      // TODO: pack CSS separately and use a <style src="..."> element instead.
      // That would be more efficient for web pages that use multiple KeyMapUI elements.
      // However, that's rare so it's not a priority.
      const styleContents = [
        // Ordered styles
        varsStyleStr,
        rootStyleStr,
        // Alphabetical styles
        diagramStyleStr,
        keygridStyleStr,
        keyInfoPanelStyleStr,
      ];
      this._styling.textContent = styleContents.join("\n");
    }
    return this._styling;
  }

  private _keyInfoNavBar: KeyInfoNavBar | null = null;
  get keyInfoNavBar(): KeyInfoNavBar {
    if (!this._keyInfoNavBar) {
      this._keyInfoNavBar = this.shadow.querySelector(
        "key-info-nav-bar"
      ) as KeyInfoNavBar;
    }
    if (!this._keyInfoNavBar) {
      this._keyInfoNavBar = document.createElement(
        "key-info-nav-bar"
      ) as KeyInfoNavBar;
      this._keyInfoNavBar.updateTitleKey(
        this.state.layer,
        this.state.kbModel,
        this.state.selectedKey
      );
    }
    return this._keyInfoNavBar;
  }

  private _diamargLeft: HTMLElement | null = null;
  get diamargLeft(): HTMLElement {
    if (!this._diamargLeft) {
      this._diamargLeft = this.shadow.querySelector(".keymap-ui-diamarg-left");
    }
    if (!this._diamargLeft) {
      this._diamargLeft = document.createElement("div");
      this._diamargLeft.className = "keymap-ui-diamarg keymap-ui-diamarg-left";
    }
    return this._diamargLeft;
  }

  private _diamargRight: HTMLElement | null = null;
  get diamargRight(): HTMLElement {
    if (!this._diamargRight) {
      this._diamargRight = this.shadow.querySelector(
        ".keymap-ui-diamarg-right"
      );
    }
    if (!this._diamargRight) {
      this._diamargRight = document.createElement("div");
      this._diamargRight.className =
        "keymap-ui-diamarg keymap-ui-diamarg-right";
    }
    return this._diamargRight;
  }

  private _centerPanel: HTMLElement | null = null;
  get centerPanel(): HTMLElement {
    if (!this._centerPanel) {
      this._centerPanel = this.shadow.querySelector(".keymap-ui-center-panel");
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
      this._kidContainer = this.shadow.querySelector(
        ".keymap-ui-kid-container"
      );
    }
    if (!this._kidContainer) {
      this._kidContainer = document.createElement("div");
      this._kidContainer.className = "keymap-ui-kid-container";
    }
    return this._kidContainer;
  }

  private _controls: KeyMapUIControls | null = null;
  get controls(): KeyMapUIControls {
    if (!this._controls) {
      this._controls = this.shadow.querySelector(
        "key-map-ui-controls"
      ) as KeyMapUIControls;
    }
    if (!this._controls) {
      this._controls = document.createElement(
        "key-map-ui-controls"
      ) as KeyMapUIControls;
    }
    if (!this._controls.state.initialized) {
      this._controls.state = this.state;
    }
    return this._controls;
  }

  private _keyboard: KeyBoard | null = null;
  get keyboard(): KeyBoard {
    if (!this._keyboard) {
      // First, try to find a keyboard in the DOM
      this._keyboard = this.shadow.querySelector("keyboard") as KeyBoard;
    }
    if (!this._keyboard) {
      // Next, look for the keyboard element by name if it was set
      if (!customElements.get(this.state.kbModel.keyboardElementName)) {
        throw new Error(
          `KeyMapUI: Keyboard element ${this.state.kbModel.keyboardElementName} not found`
        );
      }
      this._keyboard = document.createElement(
        this.state.kbModel.keyboardElementName
      ) as KeyBoard;
    }
    return this._keyboard;
  }

  private _infoContainer: HTMLElement | null = null;
  get infoContainer(): HTMLElement {
    if (!this._infoContainer) {
      this._infoContainer = this.shadow.querySelector(
        ".keymap-ui-keyinfo-container"
      );
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
      this._infoProse = this.shadow.querySelector(".key-info-prose");
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
      this._diagram = this.shadow.querySelector("key-map-ui-diagram");
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
    if (!this._diagram.state.initialized) {
      this._diagram.state = this.state;
    }
    return this._diagram;
  }

  /* Set an element's children
   *
   * If any child element is not a child of the parent,
   * remove all children and add the new children.
   */
  private setChildrenIdempotently(
    parent: HTMLElement | ShadowRoot,
    children: HTMLElement[]
  ) {
    if (!children.every((c) => parent.contains(c))) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      parent.append(...children);
    }
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
    const diagram = this.diagram;
    this.setChildrenIdempotently(this.shadow, [
      this.styling,
      this.kidContainer,
      diagram,
    ]);
    this.setChildrenIdempotently(this.kidContainer, [
      this.diamargLeft,
      this.centerPanel,
      this.diamargRight,
    ]);
    this.setChildrenIdempotently(this.centerPanel, [
      this.controls,
      this.keyboard,
      this.infoContainer,
    ]);
    this.setChildrenIdempotently(this.infoContainer, [
      this.keyInfoNavBar,
      this.infoProse,
    ]);
  }

  // #endregion

  //
  // #region Handle state changes
  //

  readonly observerName = "KeyMapUI";

  update(stateChanges: KeyMapUIStateChangeMap) {
    if (!this.isConnected) {
      return;
    }
    if (stateChanges.has("debug")) {
      log.setLevel(
        stateChanges.get("debug") ? log.levels.DEBUG : log.levels.INFO
      );
    }
    if (stateChanges.has("queryPrefix")) {
      this.#updateQueryPrefix(stateChanges.get("queryPrefix")!);
    }

    // Watch for changes in model or layer, but not keymap.
    // The model change indicates we need to replace the keyboard web component.
    // Model and keymap changes automatically trigger a change to the layer state property too.
    // The layer state property change implies recreating the keyboard's children
    // (legends, etc) and updating the title key, so for that update,
    // we only need to watch for the most specific change: the layer.
    if (stateChanges.has("kbModel")) {
      this.#updateKbModelState(stateChanges.get("kbModel")!);
    }
    if (stateChanges.has("keymap") || stateChanges.has("layer")) {
      this.keyboard.createChildren(Array.from(this.state.layer.keys.values()));
      this.#showWelcomeMessage();
    }

    if (stateChanges.has("selectedKey")) {
      this.#updateSelectedKeyState(stateChanges.get("selectedKey")!);
    }

    setQueryStringFromState(this.state, this);
  }

  #updateKbModelState(change: KeyMapUIStateChange) {
    const newKbValue = change.newValue as KeyBoardModel;
    const oldKeyboard = this.keyboard;

    this._keyboard = document.createElement(
      newKbValue.keyboardElementName
    ) as KeyBoard;
    this.keyInfoNavBar.setAttribute("key-id", "");

    // Replace the old keyboard with the new one in the DOM
    if (oldKeyboard && this.centerPanel.contains(oldKeyboard)) {
      this.centerPanel.replaceChild(this.keyboard, oldKeyboard);
    }
  }

  /* Update the selected key
   */
  #updateSelectedKeyState(change: KeyMapUIStateChange) {
    const value = change.newValue as string;
    let keySelection: string[] = [];
    const indicatedElementsById: { [key: string]: KeyHandle } = {};
    let proseKeyIndicators: KeyIndicator[] = [];
    let indicatedKeyIds: string[] = [];

    if (value) {
      const keyData = this.state.layer.keys.get(value);
      if (!keyData) {
        console.error(
          `KeyMapUI: Key ${value} not found in key map '${this.state.keymap.uniqueId}'`
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
    this.keyInfoNavBar.updateTitleKey(
      this.state.layer,
      this.state.kbModel,
      value
    );
    // this.keyInfoNavBar might not be in the DOM on initial load, so we have to lay out here.
    this.layOutIdempotently();
    const navBarHandle = this.keyInfoNavBar.querySelector("key-handle");

    // Update every key on the board
    // Make sure not to include the key in the nav bar which needs special handling
    this.keyboard.keyElements.forEach((key) => {
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

      const keyHandle = key.querySelector("key-handle") as KeyHandle;
      if (!keyHandle) return;

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
        indicatedElementsById[keyId] = keyHandle;
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

    // This causes the diagram to redraw
    this.state.connectionPairs = connectionPairs;
  }

  /* Update the query prefix and any query parameters that use it.
   */
  #updateQueryPrefix(change: KeyMapUIStateChange) {
    if (change.oldValue) {
      // Remove all old query parameters with the old prefix
      const [params, newQs] = KeyMapUIOptions.parseQueryString(
        change.oldValue as string,
        window.location.search
      );
      const newUrl = params.any
        ? `${window.location.pathname}?${newQs.toString()}`
        : `${window.location.pathname}`;
      window.history.replaceState({}, "", newUrl);
    }

    setStateFromQsAndAttrib({ state: this.state });
  }

  // #endregion

  //
  // #region Other private methods
  //

  /* Resize the canvas to the size of the kidContainer.
   *
   * Pass state to it because it's a callback for a ResizeObserver --
   * 'this' will refer to the ResizeObserver, when called by it,
   * so 'this.state' from the KeyMapUI instance will not be available.
   */
  #resizeCanvas(state: KeyMapUIState) {
    this.diagram.resize(
      this.kidContainer.offsetWidth,
      this.kidContainer.offsetHeight
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
    this.state.layer.welcome.forEach((paragraph: string) => {
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
    const e = event as CustomEvent;
    const keyId = e.detail;
    // TODO: should we have the key set the state directly instead of doing it here?
    this.state.setStatesByIds({ selectedKey: keyId });
  }

  // #endregion
}
