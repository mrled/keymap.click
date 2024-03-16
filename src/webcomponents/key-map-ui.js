import { keyMaps, legendMaps } from "~/lib/keys";
import { drawDiagram } from "~/lib/diagram";

import "~/webcomponents/key-board-ergodox";
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
  static get observedAttributes() {
    return ["keyboard-element", "selected-key"];
  }

  constructor() {
    super();
    this.trackedElements = {};
    this.addEventListener("key-selected", this.#handleKeySelected);
  }

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
    keyboard.createChildren({
      keymapName: "MrlMainLayer",
      legendmapName: "MrlLegends",
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
    // console.log("KeyMapUI#updateSelectedKey()", selectedKey, keyData);

    const navBar = this.#makeTrackedChild("navBar", "key-info-nav-bar");
    navBar.setAttribute("key-id", selectedKey);

    const indicatedKeys = this.#setKeyInfoContent(keyData);

    this.trackedElements["keyboard"].setAttribute("selected-key", selectedKey);

    this.querySelectorAll("key-grid").forEach((grid) =>
      grid.setAttribute("indicated-keys", indicatedKeys.join(","))
    );

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
        p.querySelectorAll("key-indicator").forEach((indicator) => {
          keyIndicators.push(indicator.getAttribute("key-id"));
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
    console.log(`KeyMapUI.#handleKeySelected(${JSON.stringify(event)})`);
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

  updateComponentOld() {
    this.innerHTML = `
    <>
    <div>
      <div className="keymap-ui-kid-container">
        <div className="keymap-ui-diamarg debug-bg-red" ref={diamargLeft} />

        <div className="keymap-ui-center-panel" ref={keyboardAndPanel}>
          <Keyboard targetKeyIds={targetKeyIds} />

          <div
            className="keymap-ui-keyinfo-container debug-bg-teal"
            ref={keyInfoContainer}
          >
            <InfoPanel />
          </div>
        </div>

        <div className="keymap-ui-diamarg debug-bg-red" ref={diamargRight} />
      </div>
    </div>

    {/* We place the canvas last and therefore we do not need to specify a z-index -
     * it is naturally on top of the other content.
     */}
    <Diagram
      connections={connections}
      keyboardAndPanelRect={keyboardAndPanelRect}
      diamargLeftRect={diamargLeftRect}
      diamargRightRect={diamargRightRect}
      keyInfoContainerRect={keyInfoContainerRect}
      documentDimensions={documentDimensions}
      windowSize={windowSize}
    />
  </>;
    `;
  }
}

if (!customElements.get("key-map-ui")) {
  customElements.define("key-map-ui", KeyMapUI);
}

export { KeyMapUI };
