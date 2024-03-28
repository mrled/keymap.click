import { KeyMap } from "~/lib/keyMap";

import { KeyBoardTitleBar } from "~/webcomponents/key-board-title-bar";
import { KeyBoard } from "./key-board";

/* Title bar for a key-info-panel
 *
 * TODO: Support guides
 */
export class KeyInfoNavBar extends HTMLElement {
  trackedElements: { [key: string]: HTMLElement };

  // The full keyboard element (not the title bar mini keyboard)
  referenceKeyboard: KeyBoard | null = null;

  static get observedAttributes() {
    return ["key-id"];
  }

  constructor() {
    super();
    this.trackedElements = {};
  }

  _titleBoard: KeyBoardTitleBar | null = null;
  get titleBoard(): KeyBoardTitleBar {
    if (!this._titleBoard) {
      this._titleBoard = this.querySelector(
        "key-board-title-bar"
      ) as KeyBoardTitleBar;
    }
    if (!this._titleBoard) {
      this._titleBoard = document.createElement(
        "key-board-title-bar"
      ) as KeyBoardTitleBar;
    }
    return this._titleBoard;
  }
  private titleBoardCreate() {
    if (!this.contains(this.titleBoard)) {
      this.appendChild(this.titleBoard);
    }
  }

  _deselectKeyButton: HTMLButtonElement | null = null;
  get deselectKeyButton(): HTMLButtonElement {
    if (!this._deselectKeyButton) {
      this._deselectKeyButton = this.querySelector("button.deselect-key");
    }
    if (!this._deselectKeyButton) {
      this._deselectKeyButton = document.createElement("button");
      this._deselectKeyButton.classList.add("deselect-key");
      this._deselectKeyButton.textContent = "Deselect";
      this._deselectKeyButton.addEventListener("click", () => {
        if (!this._deselectKeyButton) {
          return;
        }
        this._deselectKeyButton.dispatchEvent(
          new CustomEvent("key-selected", {
            bubbles: true,
            detail: "",
          })
        );
      });
    }
    return this._deselectKeyButton;
  }
  private deselectKeyButtonCreate() {
    if (!this.contains(this.deselectKeyButton)) {
      this.appendChild(this.deselectKeyButton);
    }
  }

  _titleH2: HTMLElement | null = null;
  get titleH2() {
    if (!this._titleH2) {
      this._titleH2 = this.querySelector("h2");
    }
    if (!this._titleH2) {
      this._titleH2 = document.createElement("h2");
    }
    return this._titleH2;
  }
  private titleH2Create() {
    if (!this.contains(this.titleH2)) {
      this.appendChild(this.titleH2);
    }
  }

  private _keyMap: KeyMap | null = null;
  get keyMap() {
    if (!this._keyMap) {
      this._keyMap = this.titleBoard.blankKeyMap;
    }
    return this._keyMap;
  }
  set keyMap(value) {
    this._keyMap = value;
  }

  connectedCallback() {
    const keyId = this.getAttribute("key-id") || "";
    this.titleBoardCreate();
    this.deselectKeyButtonCreate();
    this.titleH2Create();
    this.#updateKeyId(keyId);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "key-id":
        this.#updateKeyId(newValue);
        break;
      default:
        console.error(`KeyInfoNavBar: Unhandled attribute: ${name}`);
        break;
    }
  }

  #updateKeyId(keyId: string) {
    if (this.referenceKeyboard) {
      const modifiedKey = this.titleBoard.updateSelectedKey(
        this.keyMap,
        this.referenceKeyboard,
        keyId
      );
      this.titleH2.textContent = modifiedKey ? "Key information" : "Welcome";
      this.deselectKeyButton.disabled = !keyId;
    }
  }
}
