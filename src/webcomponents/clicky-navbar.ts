import { Keymap, KeymapKey, KeymapLayer } from "~/lib/Keymap";

import { ClickyKeyboardTitleBarElement } from "~/webcomponents/clicky-keyboard-title-bar";
import { KeyboardModel } from "~/lib/KeyboardModel";

/* Title bar for a key-info-panel
 */
export class ClickyNavbarElement extends HTMLElement {
  static readonly elementName = "clicky-navbar";

  constructor() {
    super();
  }

  _titleBoard: ClickyKeyboardTitleBarElement | null = null;
  get titleBoard(): ClickyKeyboardTitleBarElement {
    if (!this._titleBoard) {
      this._titleBoard = this.querySelector(
        ClickyKeyboardTitleBarElement.elementName
      ) as ClickyKeyboardTitleBarElement;
    }
    if (!this._titleBoard) {
      this._titleBoard = document.createElement(
        ClickyKeyboardTitleBarElement.elementName
      ) as ClickyKeyboardTitleBarElement;
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

  connectedCallback() {
    this.titleBoardCreate();
    this.deselectKeyButtonCreate();
    this.titleH2Create();
  }

  updateTitleKey(
    keymapLayer: KeymapLayer,
    referenceModel: KeyboardModel,
    selectedKeyId: string
  ) {
    const modifiedKey = this.titleBoard.updateSelectedKey(
      keymapLayer,
      referenceModel,
      selectedKeyId
    );
    if (modifiedKey.unset) {
      this.titleH2.textContent = "Welcome";
      this.deselectKeyButton.disabled = true;
    } else {
      this.titleH2.textContent = "Key information";
      this.deselectKeyButton.disabled = false;
    }
  }
}
