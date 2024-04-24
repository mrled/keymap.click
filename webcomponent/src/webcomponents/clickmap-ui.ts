import log from "~/vendor/loglevel/index.cjs";

import { ClickmapUIOptions } from "~/lib/ClickmapUIOptions";
import { ConnectionPair, KeyInfoConnectType } from "~/lib/DiagramConnections";
import { Keymap } from "~/lib/Keymap";

import { ClickmapKeyHandleElement } from "~/webcomponents/clickmap-key-handle";
import { ClickmapIndicatorElement } from "~/webcomponents/clickmap-indicator";
import { ClickmapKeyboardElement } from "./clickmap-keyboard";
import { ClickmapNavbarElement } from "~/webcomponents/clickmap-navbar";
import { ClickmapDiagramElement } from "./clickmap-diagram";
import {
  ClickmapUIState,
  ClickmapUIStateChange,
  ClickmapUIStateChangeMap,
} from "~/lib/ClickmapUIState";
import { IStateObserver } from "~/lib/State";
import {
  setQueryStringFromState,
  setStateFromQsAndAttrib,
} from "~/lib/ClickmapUIStateQueryString";

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
 * keymap-id            The name of one of the passed-in keymaps to use.
 * layer                The layer number to use.
 * selected-key         The id of the key that is selected.
 * query-prefix         A prefix for query parameters.
 *                      If set, the ClickmapUIElement will look for parameters in the URL query string with this prefix.
 *                      This attribute is not set by default,
 *                      so the ClickmapUIElement will not read from or write to the query string by default.
 *
 * Query string parameters:
 * map              The name of one of the passed-in keymaps to use.
 * layer            The layer number to use.
 * id               The id of the key to select.
 *
 * Query string example:
 * 1. The ClickmapUIElement is declared in the DOM as:
 *    <clickmap-ui selected-key="l-f-1-1" query-prefix="clickmap"></clickmap-ui>
 * 2. The user loads the URL <https://example.com/>
 *    The query string is empty, so the ClickmapUI loads with the default keymap and the l-f-1-1 key selected.
 * 3. The user loads the URL <https://example.com/?clickmap-map=mymap&clickmap-layer=2&clickmap-key=r-t-2-2>
 *    The ClickmapUIElement loads with the mymap keymap, the layer number 2, and the r-t-2-2 key selected,
 *    overriding the selected-key attribute set on the element in the DOM.
 * 4. When the user selects a key, or changes the map, the URL is updated with the new query parameters.
 */

export class ClickmapUIElement
  extends HTMLElement
  implements IStateObserver<ClickmapUIState> {
  //

  /* The element name to register with customElements.define().
   */
  static readonly elementName = "clickmap-ui";

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
  private state: ClickmapUIState;

  constructor() {
    super();

    /* Set the state object that will be passed to all children.
     */
    this.state = new ClickmapUIState();
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

  /* Removes all keymaps and replaces them with the given keymaps.
   *
   * Removes all boards and adds boards referenced by the given keymaps.
   */
  setModelsAndMaps(keymaps: Keymap[]) {
    this.state.setModelsAndMaps(keymaps);
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
    log.setLevel(log.levels.INFO);

    // The show-debug attribute doesn't set debug level in the state,
    // just whether the debug checkbox is shown.
    // It's not part of the query string stuff.
    const showDebug = this.getAttribute("show-debug") || "false";
    this.keyInfoNavbar.setAttribute("show-debug", showDebug);

    // Set the initial state from the query string and attributes
    setStateFromQsAndAttrib({
      state: this.state,
      clickmapUi: this,
    });

    this.layOutIdempotently();
    this.#updateInfoProsePanelFromState();

    // Resize the canvas to the size of the kidContainer for the first time
    this.#resizeCanvas(this.state);
    // Watch for changes in the size of the kidContainer
    this.resizeObserver.observe(this.kidContainer);
  }

  /* Call attributeChangedCallback when any of these attributes are changed from JavaScript
   * (changes to other attributes are ignored).
   */
  static get observedAttributes() {
    return ["show-debug", "keymap-id", "layer", "query-prefix", "selected-key"];
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
        this.keyInfoNavbar.setAttribute("show-debug", newValue);
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
        console.error(`ClickmapUIElement: Unhandled attribute: ${name}`);
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
      // That would be more efficient for web pages that use multiple ClickmapUIElement objects.
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

  private _keyInfoNavbar: ClickmapNavbarElement | null = null;
  get keyInfoNavbar(): ClickmapNavbarElement {
    if (!this._keyInfoNavbar) {
      this._keyInfoNavbar = this.shadow.querySelector(
        ClickmapNavbarElement.elementName
      ) as ClickmapNavbarElement;
    }
    if (!this._keyInfoNavbar) {
      this._keyInfoNavbar = document.createElement(
        ClickmapNavbarElement.elementName
      ) as ClickmapNavbarElement;
      this._keyInfoNavbar.updateTitleKey(
        this.state.layer,
        this.state.keymap.model,
        this.state.selectedKey
      );
    }
    if (!this._keyInfoNavbar.state.initialized) {
      this._keyInfoNavbar.state = this.state;
    }
    return this._keyInfoNavbar;
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

  private _keyboard: ClickmapKeyboardElement | null = null;
  get keyboard(): ClickmapKeyboardElement {
    let needsCreate = false;
    if (!this._keyboard) {
      // First, try to find a keyboard in the DOM
      this._keyboard = this.shadow.querySelector(
        "#keyboard"
      ) as ClickmapKeyboardElement;
      needsCreate = true;
    }
    if (!this._keyboard) {
      // Next, look for the keyboard element by name if it was set
      const kbElementName = this.state.keymap.model.keyboardElementName;
      if (!customElements.get(kbElementName)) {
        throw new Error(
          `ClickmapUIElement: Keyboard element ${kbElementName} not found`
        );
      }
      this._keyboard = document.createElement(
        kbElementName
      ) as ClickmapKeyboardElement;
      this._keyboard.setAttribute("id", "keyboard");
      this._keyboard.classList.add("clickmap-keyboard");
    }
    if (needsCreate) {
      this._keyboard.createChildren(Array.from(this.state.layer.keys.values()));
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

  private _diagram: ClickmapDiagramElement | null = null;
  get diagram(): ClickmapDiagramElement {
    if (!this._diagram) {
      this._diagram = this.shadow.querySelector(
        ClickmapDiagramElement.elementName
      ) as ClickmapDiagramElement;
    }
    if (!this._diagram) {
      this._diagram = document.createElement(
        ClickmapDiagramElement.elementName
      ) as ClickmapDiagramElement;
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
      this.keyboard,
      this.infoContainer,
    ]);
    this.setChildrenIdempotently(this.infoContainer, [
      this.keyInfoNavbar,
      this.infoProse,
    ]);
  }

  // #endregion

  //
  // #region Handle state changes
  //

  readonly observerName = "ClickmapUIElement";

  update(stateChanges: ClickmapUIStateChangeMap) {
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

    // If the keymap changes, the board may change too.
    if (stateChanges.has("keymap")) {
      const keymapChange = stateChanges.get("keymap")!;
      const newKeymap = keymapChange.newValue as Keymap;
      const oldKeyboard = this.keyboard;

      if (oldKeyboard.elementName != newKeymap.model.keyboardElementName) {
        this._keyboard = document.createElement(
          newKeymap.model.keyboardElementName
        ) as ClickmapKeyboardElement;
        this.keyInfoNavbar.setAttribute("key-id", "");

        // Replace the old keyboard with the new one in the DOM
        if (oldKeyboard && this.centerPanel.contains(oldKeyboard)) {
          this.centerPanel.replaceChild(this.keyboard, oldKeyboard);
        }
      }
    }

    // When the keymap or layer changes, recreate all the keys to update all the legends.
    if (stateChanges.has("keymap") || stateChanges.has("layer")) {
      this.keyboard.createChildren(Array.from(this.state.layer.keys.values()));
    }

    if (
      stateChanges.has("keymap") ||
      stateChanges.has("layer") ||
      stateChanges.has("guideStep") ||
      stateChanges.has("guide") ||
      stateChanges.has("selectedKey")
    ) {
      this.#updateInfoProsePanelFromState();
    }

    setQueryStringFromState(this.state, this);
  }

  /* Update the info prose panel based on active key, guide step, etc.
   */
  #updateInfoProsePanelFromState() {
    let activeKeyId: string = "";
    let keySelection: string[] = [];
    let proseTitleElement = document.createElement("h3");
    let proseTextElements: HTMLParagraphElement[] = [];
    const indicatedElementsById: {
      [key: string]: ClickmapKeyHandleElement;
    } = {};
    let proseKeyIndicators: ClickmapIndicatorElement[] = [];
    let indicatedKeyIds: string[] = [];

    if (this.state.guideStep) {
      if (this.state.guideStep.keyId) {
        activeKeyId = this.state.guideStep.keyId;
      }
    } else {
      activeKeyId = this.state.selectedKey;
    }

    // Clear the existing content in the key info prose panel
    while (this.infoProse.firstChild) {
      this.infoProse.removeChild(this.infoProse.firstChild);
    }

    if (activeKeyId) {
      // If there's an active key, show the key information in the prose panel.
      // (This will also trigger if the active key is in a guide step.)
      const keyData = this.state.layer.keys.get(activeKeyId);
      if (!keyData) {
        console.error(
          `ClickmapUIElement: Key ${activeKeyId} not found in key map '${this.state.keymap.uniqueId}'`
        );
        return;
      }
      keySelection = keyData.selection || [];
      proseTitleElement.innerHTML = keyData.unset
        ? `Unset key`
        : `The <kbd>${keyData.name}</kbd> key`;
      proseTextElements = keyData.info.map((paragraph: string) => {
        const p = document.createElement("p");
        p.innerHTML = paragraph;
        return p;
      });
    } else if (this.state.guideStep?.text?.length || 0 > 0) {
      // If there's an active guide step but not an active key,
      // show the guide step information in the prose panel
      const guideStep = this.state.guideStep!;
      keySelection = guideStep.selection || [];
      proseTitleElement.innerHTML = guideStep.title || "";
      proseTextElements =
        guideStep.text?.map((paragraph: string) => {
          const p = document.createElement("p");
          p.innerHTML = paragraph;
          return p;
        }) || [];
    } else {
      // If there's no active key or guide step, show the current layer's welcome text
      keySelection = [];
      proseTitleElement.innerText = this.state.layer.displayName;
      proseTextElements = this.state.layer.welcome.map((paragraph: string) => {
        const p = document.createElement("p");
        p.innerHTML = paragraph;
        return p;
      });
    }

    this.infoProse.appendChild(proseTitleElement);
    this.infoProse.append(...proseTextElements);

    proseKeyIndicators = Array.from(
      this.infoProse.querySelectorAll(ClickmapIndicatorElement.elementName)
    );
    // Construct a list of all keys indicated in the prose
    indicatedKeyIds = proseKeyIndicators.map(
      (indicator) => indicator.getAttribute("id") || ""
    );

    // Clear any existing connections that back the diagram lines
    const connectionPairs: ConnectionPair[] = [];

    // Update the key in the key info navbar
    this.keyInfoNavbar.updateTitleKey(
      this.state.layer,
      this.state.keymap.model,
      activeKeyId
    );
    // this.keyInfoNavbar might not be in the DOM on initial load, so we have to lay out here.
    this.layOutIdempotently();
    const navBarHandle = this.keyInfoNavbar.querySelector(
      ClickmapKeyHandleElement.elementName
    );

    // Update every key on the board
    // Make sure not to include the key in the nav bar which needs special handling
    this.keyboard.keyElements.forEach((key) => {
      const keyId = key.getAttribute("id");
      if (!keyId) {
        console.error(
          `ClickmapUIElement: Keyboard child key has no id: ${key}`
        );
        return;
      }
      const active = keyId === activeKeyId;
      const inKeySelection = !active && keySelection.indexOf(keyId) > -1;
      const indicatorTarget = indicatedKeyIds.indexOf(keyId) > -1;
      key.setAttribute("active", active.toString());
      key.setAttribute("related-to-active", inKeySelection.toString());
      key.setAttribute("target-of-indicator", indicatorTarget.toString());

      const keyHandle = key.querySelector(
        ClickmapKeyHandleElement.elementName
      ) as ClickmapKeyHandleElement;
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
        console.error(
          `ClickmapUIElement: Key indicator has no id: ${indicator}`
        );
        return;
      }
      const indicated = indicatedElementsById[indicatorId];
      if (!indicated) {
        console.error(
          `ClickmapUIElement: Key indicator has no target: ${indicatorId}`
        );
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
  #updateQueryPrefix(change: ClickmapUIStateChange) {
    if (change.oldValue) {
      // Remove all old query parameters with the old prefix
      const [params, newQs] = ClickmapUIOptions.parseQueryString(
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
   * so 'this.state' from the ClickmapUIElement instance will not be available.
   */
  #resizeCanvas(state: ClickmapUIState) {
    this.diagram.resize(
      this.kidContainer.offsetWidth,
      this.kidContainer.offsetHeight
    );
  }

  /* Handle a key being selected on the keyboard
   *
   * This is a custom event that is fired by <clickmap-key> elements.
   */
  #handleKeySelected(event: Event) {
    const e = event as CustomEvent;
    const keyId = e.detail;
    // TODO: should we have the key set the state directly instead of doing it here?
    this.state.setStatesByIds({ selectedKey: keyId });
  }

  // #endregion
}
