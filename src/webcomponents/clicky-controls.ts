import { ClickyUIState, ClickyUIStateChangeMap } from "~/lib/ClickyUIState";
import { IStateObserver } from "~/lib/State";

enum SelectId {
  Debug = "debug",
  Keymap = "keymap",
  Layer = "layer",
  Guide = "guide",
}

type ChangeListenerFunction = (
  e: Event,
  selectId: SelectId,
  selectElement: HTMLSelectElement
) => void;

/* Controls for clicky-ui
 */
export class ClickyControlsElement
  extends HTMLElement
  implements IStateObserver<ClickyUIState> {
  //

  static readonly elementName = "clicky-controls";

  static readonly observedAttributes = ["show-debug"];

  private showDebug = false;

  private _state: ClickyUIState = new ClickyUIState();
  set state(value: ClickyUIState) {
    this._state = value;
    this._state.attach(this);
    this.updateAll();
  }
  get state(): ClickyUIState {
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

  readonly observerName = "ClickyUIControls";

  /* Update the controls when the state changes.
   *
   * We want to update if either the *available* keymaps/layers/guides change,
   * so that we can change the options in the dropdowns,
   * or if the *selected* ones change, so that we can show the currently selected option.
   *
   * Each of these user input elements has a way to check for both changes.
   * For changes to the available keymaps,
   * there is a dedicated property containing all available items.
   * For changes to the layers and guides,
   * we watch for changes to the selected keymap.
   *
   *  ============|===================|=================
   *    controls  |  available items  |  selected item
   *  ============|===================|=================
   *   keymaps    |     keymaps       |    keymap
   *   layers     |     keymap        |    layer
   *   guides     |     keymap        |    guide
   *  ============|===================|=================
   *
   * Keep in mind which state automatically updates other state --
   * for instance, changes to the selected keymap will automatically
   * update the selected layer and guide.
   */
  update(stateChanges: ClickyUIStateChangeMap) {
    if (stateChanges.get("debug")) {
      this.updateDebugSelector();
    }
    if (stateChanges.get("keymaps") || stateChanges.get("keymap")) {
      this.updateKeymapsSelector();
    }
    if (
      stateChanges.get("keymaps") ||
      stateChanges.get("keymap") ||
      stateChanges.get("guide") ||
      stateChanges.get("guideStep")
    ) {
      this.updateGuidesSelector();
    }
    if (stateChanges.get("keymap") || stateChanges.get("layer")) {
      this.updateLayersSelector();
    }
    if (stateChanges.get("guide") || stateChanges.get("guideStep")) {
      this.updateGuidesSelector();
      this.layoutIdempmotently();
      this.updateGuideControls();
    }
  }

  private updateAll() {
    this.updateDebugSelector();
    this.updateKeymapsSelector();
    this.updateLayersSelector();
    this.updateGuidesSelector();
    this.updateGuideControls();
  }

  /* Called when the user selects a keymap from the dropdown
   */
  private chooseKeymap: ChangeListenerFunction = (e, id, result) => {
    this.state.setStatesByIds({
      keymapId: result.value,
    });
  };

  /* Called when the user selects a layer from the dropdown
   */
  private chooseLayer: ChangeListenerFunction = (e, id, result) => {
    this.state.setStatesByIds({
      layerIdx: parseInt(result.value),
    });
  };

  /* Called when the user selects a guide from the dropdown
   */
  private chooseGuide: ChangeListenerFunction = (e, id, result) => {
    this.state.setStatesByIds({ guideId: result.value });
  };

  /* Update the debug checkbox.
   * Called when the debug state changes.
   */
  private updateDebugSelector() {
    const debugCheckbox = this.shadow.querySelector(
      `#${SelectId.Debug}`
    ) as HTMLInputElement;
    if (!debugCheckbox) {
      return;
    }
    debugCheckbox.checked = this.state.debug === 1;
  }

  /* Update the keymap selection dropdown.
   * Called when the list of available keymaps changes or the selected keymap changes.
   */
  private updateKeymapsSelector() {
    const options = Array.from(this.state.keymaps).map(([keymapId, keymap]) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = keymapId;
      option.selected = keymap.uniqueId === this.state.keymap.uniqueId;
      option.textContent = `${keymap.displayName} (${keymap.model.displayName})`;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(
      SelectId.Keymap,
      options,
      "No keymaps available",
      this.chooseKeymap
    );
  }

  /* Update the layer selection dropdown.
   * Called when the list of available layers changes or the selected layer changes.
   */
  private updateLayersSelector() {
    const options = this.state.keymap.layers.map((layer, idx) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = idx.toString();
      option.selected =
        idx === this.state.keymap.layers.indexOf(this.state.layer);
      option.textContent = layer.displayName;
      return option;
    }, [] as HTMLOptionElement[]);
    this.updateSelector(
      SelectId.Layer,
      options,
      "No layers available",
      this.chooseLayer
    );
  }

  /* Update the guide selection dropdown.
   * Called when the list of available guides changes or the selected guide changes.
   */
  private updateGuidesSelector() {
    const noGuideSelectedOption = document.createElement("option");
    noGuideSelectedOption.value = "";
    noGuideSelectedOption.textContent = "No guide selected";
    noGuideSelectedOption.selected = this.state.guide === null;

    const guideOptions = this.state.keymap.guides.map((guide, idx) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = guide.id;
      option.selected = guide.title === this.state.guide?.title;
      option.textContent = guide.title;
      return option;
    }, [] as HTMLOptionElement[]);
    const options = [noGuideSelectedOption, ...guideOptions];
    this.updateSelector(
      SelectId.Guide,
      options,
      "No guides available",
      this.chooseGuide
    );
  }

  /* Update the guide step controls
   */
  private updateGuideControls() {
    if (this.state.guideStep) {
      if (this.state.guideStep.isFirstStep) {
        this.shadow.querySelector("#prev-step")?.setAttribute("disabled", "");
      } else {
        this.shadow.querySelector("#prev-step")?.removeAttribute("disabled");
      }
      if (this.state.guideStep.isLastStep) {
        this.shadow.querySelector("#next-step")?.setAttribute("disabled", "");
      } else {
        this.shadow.querySelector("#next-step")?.removeAttribute("disabled");
      }
    }
  }

  // #endregion

  //
  // #region Child elements and styling
  //

  /* Style HTMLElement
   */
  get styleElement(): HTMLStyleElement {
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
      if (this.state.guide === null) {
        result.innerText += `
          .guide-controls {
            display: none;
          }
        `;
      }
    }
    return result;
  }

  /* Debug pair (checkbox and label)
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
    label.textContent = "🚫🐞";

    const span = document.createElement("span");
    span.append(checkbox, label);
    return span;
  }

  /* Guide controls
   */
  get guideControls(): HTMLSpanElement {
    const prevButton = document.createElement("button");
    prevButton.id = "prev-step";
    prevButton.textContent = "Previous step";
    prevButton.addEventListener("click", () => {
      if (this.state.guideStep && !this.state.guideStep.isFirstStep) {
        this.state.setStatesByIds({
          guideStepIdx: this.state.guideStep.index - 1,
        });
      }
    });
    const nextButton = document.createElement("button");
    nextButton.id = "next-step";
    nextButton.textContent = "Next step";
    nextButton.addEventListener("click", () => {
      if (this.state.guideStep && !this.state.guideStep.isLastStep) {
        this.state.setStatesByIds({
          guideStepIdx: this.state.guideStep.index + 1,
        });
      }
    });
    const exitButton = document.createElement("button");
    exitButton.textContent = "Exit guide";
    exitButton.addEventListener("click", () => {
      this.state.setStatesByIds({ guideId: "" });
    });

    const span = document.createElement("span");
    span.className = "guide-controls";
    span.append(prevButton, nextButton, exitButton);
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
    } else if (options.length === 1) {
      select.disabled = true;
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

  /* Lay out the child elements.
   */
  private layoutIdempmotently() {
    while (this.shadow.firstChild) {
      this.shadow.removeChild(this.shadow.firstChild);
    }
    this.shadow.appendChild(this.styleElement);
    if (this.showDebug) {
      this.shadow.appendChild(this.debugPair);
    }
    this.shadow.append(
      this.getPair(SelectId.Keymap, "Keymap", this.chooseKeymap),
      this.getPair(SelectId.Layer, "Layer", this.chooseLayer),
      this.getPair(SelectId.Guide, "Guide", this.chooseGuide),
      this.guideControls
    );
    this.updateAll();
  }

  // #endregion
}
