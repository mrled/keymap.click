import log from "loglevel";

import { KeyMapUIState, KeyMapUIStateChangeMap } from "~/lib/KeyMapUIState";
import { KeyMapUI } from "./key-map-ui";
import { IStateObserver } from "~/lib/State";

/* KeyMapUIDebugConsole: A little area to show debugging information
 */
export class KeyMapUIDebugConsole
  extends HTMLElement
  implements IStateObserver<KeyMapUIState> {
  //

  _keyMapUi: KeyMapUI | null = null;
  get keyMapUi(): KeyMapUI | null {
    return this._keyMapUi;
  }
  set keyMapUi(value: KeyMapUI) {
    this._keyMapUi = value;
    this.render();
  }

  _state: KeyMapUIState | null = null;
  get state(): KeyMapUIState | null {
    return this._state;
  }
  set state(value: KeyMapUIState) {
    this._state = value;
    this._state.attach(this);
    this.render();
  }

  isReady(): boolean {
    return this.isConnected && this.state !== null && this.keyMapUi !== null;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.render();
  }

  readonly observerName = "KeyMapUIDebugConsole";

  update<KeyMapUIState>(stateChanges: KeyMapUIStateChangeMap) {
    log.debug(
      "KeyMapUIDebugConsole.update() called with stateChanges:",
      stateChanges
    );
    this.render();
  }

  /* Show debugging information
   */
  render() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    if (!this.isReady()) {
      return;
    }
    const state = this.state!;
    const keyMapUi = this.keyMapUi!;

    if (state.debug === 0) {
      this.setAttribute("style", "display: none");
      return;
    } else {
      this.setAttribute(
        "style",
        "display: block; border: 1px solid black; padding: 1em; margin: 1em; text-align: left; font-family: monospace;"
      );
    }

    const style = document.createElement("style");
    style.textContent = `
      ul {
        padding-top: 0;
      }
    `;
    this.appendChild(style);

    const h2 = document.createElement("h2");
    h2.textContent = "Debug console";
    this.appendChild(h2);

    const stateOutline = objectToOutline(state);
    this.appendChild(stateOutline);
  }
}

/* Given any object, return an outline of its structure as an HTML <ul> with collapsible sections
 */
function objectToOutline(
  obj: Record<string, any>,
  seen: Set<any> = new Set()
): HTMLElement {
  const ul = document.createElement("ul");
  // Check if the current object has already been seen to handle root-level circular references
  if (seen.has(obj)) {
    const li = document.createElement("li");
    li.textContent = `Previously seen object of type ${typeof obj}`;
    ul.appendChild(li);
    return ul;
  }
  seen.add(obj);

  for (const [key, value] of Object.entries(obj)) {
    const li = document.createElement("li");

    if (Array.isArray(value)) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = key;
      details.appendChild(summary);

      const innerUl = document.createElement("ul");
      for (const item of value) {
        const innerLi = document.createElement("li");
        if (typeof item === "object" && item !== null) {
          if (!seen.has(item)) {
            innerLi.appendChild(objectToOutline(item, seen));
          } else {
            // Display a message for previously seen objects
            innerLi.textContent = `Previously seen object of type ${
              Array.isArray(item) ? "array" : typeof item
            }`;
          }
        } else {
          innerLi.textContent = item;
        }
        innerUl.appendChild(innerLi);
      }

      details.appendChild(innerUl);
      li.appendChild(details);
    } else if (typeof value === "object" && value !== null) {
      if (!seen.has(value)) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = key;
        details.appendChild(summary);

        details.appendChild(objectToOutline(value, seen));
        li.appendChild(details);
      } else {
        // For non-array objects that have been seen before
        li.textContent = `Previously seen object of type ${typeof value}`;
      }
    } else {
      li.textContent = `${key}: ${value}`;
    }

    ul.appendChild(li);
  }

  return ul;
}
