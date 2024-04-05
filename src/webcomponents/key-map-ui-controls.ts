import { KeyMapUIState } from "~/lib/KeyMapUIState";
import { IStateObserver } from "~/lib/State";
import { KeyMap } from "~/lib/keyMap";

enum SelectId {
  Debug = "debug",
  Keyboard = "keyboard",
  Keymap = "keymap",
  Layer = "layer",
  Guide = "guide",
}

type ChangeListenerFunction = (
  e: Event,
  selectId: SelectId,
  selectElement: HTMLSelectElement
) => void;

/* Controls for key-map-ui
 */
export class KeyMapUIControls
  extends HTMLElement
  implements IStateObserver<KeyMapUIState> {
  //

  static readonly observedAttributes = ["show-debug"];

  private showDebug = false;

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

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "show-debug":
        this.showDebug = newValue === "true";
        this.layoutIdempmotently();
        break;
      default:
        console.error(`Unknown attribute ${name}`);
        break;
    }
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

  private chooseKbModel: ChangeListenerFunction = (e, id, result) => {
    console.log(`Selected ${id}: ${result.value}`);
    const newModel = this.state.kbModels.find(
      (model) => model.keyboardElementName === result.value
    );
    if (newModel) {
      this.state.kbModel = newModel;
    }
  };

  private chooseKeymap: ChangeListenerFunction = (e, id, result) => {
    console.log(`Selected ${id}: ${result.value}`);
    const newKeymap = this.state.keymaps
      .get(this.state.kbModel.keyboardElementName)
      ?.get(result.value);
    if (newKeymap) {
      this.state.keymap = newKeymap;
    }
  };

  private chooseLayer: ChangeListenerFunction = (e, id, result) => {
    console.log(`Selected ${id}: ${result.value}`);
    this.state.layer = parseInt(result.value);
  };

  private chooseGuide: ChangeListenerFunction = (e, id, result) => {
    console.log(`Selected ${id}: ${result.value}`);
    this.state.guide = result.value;
  };

  private updateKbModelsSelector() {
    const options = this.state.kbModels.map((model) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = model.keyboardElementName;
      option.selected = model === this.state.kbModel;
      option.textContent = model.keyboardElementName;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(
      SelectId.Keyboard,
      options,
      "No keyboards available",
      this.chooseKbModel
    );
  }

  private updateKeymapsSelector() {
    const boardMaps = this.state.boardMaps;
    const options = Array.from(boardMaps).map(([keymapId, keymap]) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = keymapId;
      option.selected = keymap === this.state.keymap;
      option.textContent = keymap.displayName;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(
      SelectId.Keymap,
      options,
      "No keymaps available",
      this.chooseKeymap
    );
  }

  private updateLayersSelector() {
    const options = this.state.keymap.layers.map((layer, idx) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = idx.toString();
      option.selected = idx === this.state.layer;
      option.textContent = `Layer ${idx}`;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(
      SelectId.Layer,
      options,
      "No layers available",
      this.chooseLayer
    );
  }

  private updateGuidesSelector() {
    const options = this.state.keymap.guides.map((guide, idx) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = idx.toString();
      option.selected = guide.title === this.state.guide;
      option.textContent = `Placeholder guide ${idx}`;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(
      SelectId.Guide,
      options,
      "No guides available",
      this.chooseGuide
    );
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

  /* Debug checkbox
   */
  get debugPair(): HTMLSpanElement {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = SelectId.Debug;
    checkbox.addEventListener("change", () => {
      this.state.debug = checkbox.checked ? 1 : 0;
    });
    const label = document.createElement("label");
    label.htmlFor = SelectId.Debug;
    label.textContent = "Enable debugging";

    const span = document.createElement("span");
    span.append(checkbox, label);
    return span;
  }

  /* Update the options in a select element.
   */
  private updateSelector(
    selectId: SelectId,
    options: HTMLOptionElement[],
    noOptionsText: string,
    changeListener: ChangeListenerFunction
  ) {
    const select = this.getSelect(selectId, changeListener);
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
  private getSelect(
    id: SelectId,
    changeListener: ChangeListenerFunction
  ): HTMLSelectElement {
    let result = this.shadow.querySelector(`#${id}`) as HTMLSelectElement;
    if (!result) {
      result = document.createElement("select");
      result.id = id;
      result.addEventListener("change", (e: Event) =>
        changeListener(e, id, result)
      );
    }
    return result;
  }

  /* Get a span element containing a label and a select element.
   * Use the select element's ID to make the span's ID.
   */
  private getPair(
    selectId: SelectId,
    labelText: string,
    changeListener: ChangeListenerFunction
  ): HTMLSpanElement {
    const spanId = `${selectId}-pair`;
    let result = this.shadow.querySelector(`span#${spanId}`) as HTMLSpanElement;
    if (!result) {
      result = document.createElement("span");
      result.id = spanId;
      result.append(
        this.getLabel(selectId, labelText),
        this.getSelect(selectId, changeListener)
      );
    }
    return result;
  }

  private layoutIdempmotently() {
    while (this.shadow.firstChild) {
      this.shadow.removeChild(this.shadow.firstChild);
    }
    this.shadow.appendChild(this.styleElement);
    if (this.showDebug) {
      this.shadow.appendChild(this.debugPair);
    }
    this.shadow.append(
      this.getPair(SelectId.Keyboard, "Keyboard", this.chooseKbModel),
      this.getPair(SelectId.Keymap, "Keymap", this.chooseKeymap),
      this.getPair(SelectId.Layer, "Layer", this.chooseLayer),
      this.getPair(SelectId.Guide, "Guide", this.chooseGuide)
    );
    this.updateAll();
  }

  // #endregion
}
