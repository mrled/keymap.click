import { KeyMapUIState } from "~/lib/KeyMapUIState";
import { IStateObserver } from "~/lib/State";
import { KeyMap } from "~/lib/keyMap";

enum SelectId {
  Keyboard = "keyboard",
  Keymap = "keymap",
  Layer = "layer",
  Guide = "guide",
}

/* Controls for key-map-ui
 */
export class KeyMapUIControls
  extends HTMLElement
  implements IStateObserver<KeyMapUIState> {
  //

  private _state: KeyMapUIState = new KeyMapUIState();
  set state(value: KeyMapUIState) {
    this._state = value;
    this._state.attach(this);
    this.updateAll();
  }
  get state(): KeyMapUIState {
    return this._state;
  }

  private shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
  }

  connectedCallback() {
    this.layoutIdempmotently();
  }

  //
  // #region Observed state
  //

  update<T extends keyof KeyMapUIState>(
    key: T,
    oldValue: KeyMapUIState[T],
    newValue: KeyMapUIState[T]
  ) {
    this.updateAll();
    switch (key) {
      case "kbModels":
      case "kbModel":
        this.updateKbModelsSelector();
        break;
      case "keymaps":
      case "keymap":
        this.updateKeymapsSelector();
        break;
      case "layer":
        this.updateLayersSelector();
        break;
      case "guide":
        this.updateGuidesSelector();
        break;
    }
  }

  private updateAll() {
    this.updateKbModelsSelector();
    this.updateKeymapsSelector();
    this.updateLayersSelector();
    this.updateGuidesSelector();
  }

  private updateKbModelsSelector() {
    const options = this.state.kbModels.map((model) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = model.keyboardElementName;
      option.textContent = model.keyboardElementName;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(SelectId.Keyboard, options, "No keyboards available");
  }

  private updateKeymapsSelector() {
    const boardKeymaps: Map<string, KeyMap> =
      this.state.keymaps.get(this.state.keymap.uniqueId) || new Map();
    const options = Array.from(boardKeymaps).map(([keymapId, keymap]) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = keymapId;
      option.textContent = keymap.displayName;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(SelectId.Keymap, options, "No keymaps available");
  }

  private updateLayersSelector() {
    const options = this.state.keymap.layers.map((layer, idx) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = idx.toString();
      option.textContent = `Layer ${idx}`;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(SelectId.Layer, options, "No layers available");
  }

  private updateGuidesSelector() {
    const options = this.state.keymap.guides.map((guide, idx) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = idx.toString();
      option.textContent = `Placeholder guide ${idx}`;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(SelectId.Guide, options, "No guides available");
  }

  // #endregion

  //
  // #region Child elements and styling
  //

  get styleElement() {
    let result = this.shadow.querySelector("style");
    if (!result) {
      result = document.createElement("style");
      result.innerText = `
        span {
          display: inline-block;
          margin-left: 2em;
          padding: 0.5em;
        }
        select {
          margin-left: 1em;
        }
      `;
    }
    return result;
  }

  /* Update the options in a select element.
   */
  private updateSelector(
    selectId: SelectId,
    options: HTMLOptionElement[],
    noOptionsText: string
  ) {
    const select = this.getSelect(selectId);
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
    if (options.length === 0) {
      select.disabled = true;
      const option = document.createElement("option");
      option.value = "none";
      option.textContent = noOptionsText;
      options.push(option);
    } else {
      select.disabled = false;
    }
    select.append(...options);
  }

  /* Get a label element by the ID of its select element.
   * If it doesn't exist, create it.
   */
  private getLabel(forItem: SelectId, text: string): HTMLLabelElement {
    let result = this.shadow.querySelector(
      `label[for="${forItem}"]`
    ) as HTMLLabelElement;
    if (!result) {
      result = document.createElement("label");
      result.setAttribute("for", forItem);
      result.textContent = text;
    }
    return result;
  }

  /* Get a select element by its ID.
   * If it doesn't exist, create it.
   */
  private getSelect(id: SelectId): HTMLSelectElement {
    let created = false;
    let result = this.shadow.querySelector(`#${id}`) as HTMLSelectElement;
    if (!result) {
      created = true;
      result = document.createElement("select");
      result.id = id;
    }
    return result;
  }

  /* Get a span element containing a label and a select element.
   * Use the select element's ID to make the span's ID.
   */
  private getPair(selectId: SelectId, labelText: string): HTMLSpanElement {
    const spanId = `${selectId}-pair`;
    let result = this.shadow.querySelector(`span#${spanId}`) as HTMLSpanElement;
    if (!result) {
      result = document.createElement("span");
      result.id = spanId;
      result.append(
        this.getLabel(selectId, labelText),
        this.getSelect(selectId)
      );
    }
    return result;
  }

  private layoutIdempmotently() {
    while (this.shadow.firstChild) {
      this.shadow.removeChild(this.shadow.firstChild);
    }
    this.shadow.append(
      this.styleElement,
      this.getPair(SelectId.Keyboard, "Keyboard"),
      this.getPair(SelectId.Keymap, "Keymap"),
      this.getPair(SelectId.Layer, "Layer"),
      this.getPair(SelectId.Guide, "Guide")
    );
    this.updateAll();
  }

  // #endregion
}
