import { ClickyUIState, ClickyUIStateChangeMap } from "~/lib/ClickyUIState";
import { KeyboardModel } from "~/lib/KeyboardModel";
import { KeymapLayer } from "~/lib/Keymap";
import { IStateObserver } from "~/lib/State";
import { ClickyKeyboardTitleBarElement } from "~/webcomponents/clicky-keyboard-title-bar";

// #region Helper types

/* A wrapper class that provides helper methods for selectors.
 *
 * It takes a string primitive like 'asdf-sel'
 * and provides properties like .i for '#asdf-sel' and .c for '.asdf-sel'.
 */
class Selector {
  constructor(public r: string) {}
  toString() {
    return this.r;
  }

  /* Get the selector as a CSS-style ID
   */
  get i() {
    return "#" + this.r;
  }

  /* Get the selector as a CSS-style class
   */
  get c() {
    return "." + this.r;
  }
}

/* Selectors that we use in code
 *
 * These are used to find elements in the DOM.
 * They don't include selectors we use in separate CSS files,
 * because those have to be string-matched anyway.
 * But they do include selectors that we use in JavaScript.
 */
const Slctr = {
  Debug: new Selector("debug"),
  Keymap: new Selector("keymap"),
  Layer: new Selector("layer"),
  Guide: new Selector("guide"),
  CtrlButtons: new Selector("control-buttons"),
  GuideNext: new Selector("guide-next-step"),
  GuidePrev: new Selector("guide-prev-step"),
  LayerHome: new Selector("layer-home"),
} as const;
type Sels = typeof Slctr[keyof typeof Slctr];

type ChangeListenerFunction = (
  e: Event,
  selectId: string,
  selectElement: HTMLSelectElement
) => void;

// #endregion

// #region Class definition

/* Title bar for a key-info-panel
 */
export class ClickyNavbarElement
  extends HTMLElement
  implements IStateObserver<ClickyUIState> {
  //

  // #region Constructor and lifecycle

  static readonly elementName = "clicky-navbar";

  static readonly observedAttributes = ["show-debug"];

  constructor() {
    super();
  }

  connectedCallback() {
    this.updateAll();
    this.layoutIdempotently();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "show-debug":
        this.showHideElement(this.debugPair, this.showDebug);
        break;
      default:
        console.error(`Unknown attribute ${name}`);
        break;
    }
  }

  get showDebug(): boolean {
    return this.getAttribute("show-debug") === "true";
  }

  // #endregion

  // #region Public methods

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

    if (selectedKeyId || this.state.guide) {
      this.layerHomeButton.disabled = false;
    } else {
      this.layerHomeButton.disabled = true;
    }
  }

  // #endregion

  // #region Observed state

  readonly observerName = "ClickyUIControls";

  private _state: ClickyUIState = new ClickyUIState();
  set state(value: ClickyUIState) {
    this._state = value;
    this._state.attach(this);
    this.updateAll();
  }
  get state(): ClickyUIState {
    return this._state;
  }

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
    const debugCheckbox = this.querySelector(Slctr.Debug.i) as HTMLInputElement;
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
      Slctr.Keymap,
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
      Slctr.Layer,
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
      Slctr.Guide,
      options,
      "No guides available",
      this.chooseGuide
    );
  }

  /* Update the guide step controls
   */
  private updateGuideControls() {
    const inGuide = this.state.guide !== null;
    this.showHideElement(this.guidePrevButton, inGuide);
    this.showHideElement(this.guideNextButton, inGuide);
    console.log(
      `updateGuideControls. null: ${this.state.guide === null}, !null: ${
        this.state.guide !== null
      }, guide: `,
      this.state.guide
    );
    if (this.state.guideStep) {
      if (this.state.guideStep.isFirstStep) {
        this.querySelector(Slctr.GuidePrev.i)?.setAttribute("disabled", "");
      } else {
        this.querySelector(Slctr.GuidePrev.i)?.removeAttribute("disabled");
      }
      if (this.state.guideStep.isLastStep) {
        this.querySelector(Slctr.GuideNext.i)?.setAttribute("disabled", "");
      } else {
        this.querySelector(Slctr.GuideNext.i)?.removeAttribute("disabled");
      }
    }
  }

  // #endregion

  // #region Child elements

  /* Debug pair (checkbox and label)
   */
  private _debugPair: HTMLSpanElement | null = null;
  get debugPair(): HTMLSpanElement {
    if (!this._debugPair) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("id", Slctr.Debug.r);
      // checkbox.id = SelectId.Debug;
      checkbox.addEventListener("change", () => {
        this.state.debug = checkbox.checked ? 1 : 0;
      });
      const label = document.createElement("label");
      label.htmlFor = Slctr.Debug.r;
      label.textContent = "Debug ";

      this._debugPair = document.createElement("span");
      this._debugPair.setAttribute("id", "debug-pair");
      this._debugPair.classList.add("controls-pair");
      this._debugPair.append(label, checkbox);

      this.showHideElement(this._debugPair, this.showDebug);
    }
    return this._debugPair;
  }

  /* Keymap navigation controls
   */
  private _layerHomeButton: HTMLButtonElement | null = null;
  get layerHomeButton(): HTMLButtonElement {
    if (!this._layerHomeButton) {
      this._layerHomeButton = document.createElement("button");
      this._layerHomeButton.setAttribute("id", Slctr.LayerHome.r);
      this._layerHomeButton.classList.add("control-button");
      this._layerHomeButton.textContent = "🏠";
      this._layerHomeButton.ariaLabel = "Go to layer home";
      this._layerHomeButton.addEventListener("click", () => {
        this.state.setStatesByIds({ guideId: "", selectedKey: "" });
      });
    }
    return this._layerHomeButton;
  }
  private _guidePrevButton: HTMLButtonElement | null = null;
  get guidePrevButton(): HTMLButtonElement {
    if (!this._guidePrevButton) {
      this._guidePrevButton = document.createElement("button");
      this._guidePrevButton.setAttribute("id", Slctr.GuidePrev.r);
      this._guidePrevButton.classList.add("control-button");
      this._guidePrevButton.textContent = "<";
      this._guidePrevButton.ariaLabel = "Previous step";
      this._guidePrevButton.addEventListener("click", () => {
        if (this.state.guideStep && !this.state.guideStep.isFirstStep) {
          this.state.setStatesByIds({
            guideStepIdx: this.state.guideStep.index - 1,
          });
        }
      });
      this.showHideElement(this._guidePrevButton, this.state.guide !== null);
    }
    return this._guidePrevButton;
  }
  private _guideNextButton: HTMLButtonElement | null = null;
  get guideNextButton(): HTMLButtonElement {
    if (!this._guideNextButton) {
      this._guideNextButton = document.createElement("button");
      this._guideNextButton.setAttribute("id", Slctr.GuideNext.r);
      this._guideNextButton.classList.add("control-button");
      this._guideNextButton.textContent = ">";
      this._guideNextButton.ariaLabel = "Next step";
      this._guideNextButton.addEventListener("click", () => {
        if (this.state.guideStep && !this.state.guideStep.isLastStep) {
          this.state.setStatesByIds({
            guideStepIdx: this.state.guideStep.index + 1,
          });
        }
      });
      this.showHideElement(this._guideNextButton, this.state.guide !== null);
    }
    return this._guideNextButton;
  }
  private _controls: HTMLSpanElement | null = null;
  get controls(): HTMLSpanElement {
    if (!this._controls) {
      this._controls = document.createElement("span") as HTMLSpanElement;
      this._controls.className = Slctr.CtrlButtons.r;
      this._controls.setAttribute("id", Slctr.CtrlButtons.r);
      this._controls.append(
        this.layerHomeButton,
        this.guidePrevButton,
        this.guideNextButton
      );
    }
    return this._controls;
  }

  /* Update the options in a select element.
   */
  private updateSelector(
    selectId: Sels,
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
  private getLabel(forItem: Sels, text: string): HTMLLabelElement {
    let result = this.querySelector(
      `label[for="${forItem}"]`
    ) as HTMLLabelElement;
    if (!result) {
      result = document.createElement("label");
      result.setAttribute("for", forItem.r);
      result.textContent = text;
    }
    return result;
  }

  /* Get a select element by its ID.
   * If it doesn't exist, create it.
   */
  private getSelect(
    selector: Sels,
    changeListener: ChangeListenerFunction
  ): HTMLSelectElement {
    let result = this.querySelector(selector.i) as HTMLSelectElement;
    if (!result) {
      result = document.createElement("select");
      // result.id = id;
      result.setAttribute("id", selector.r);
      result.addEventListener("change", (e: Event) =>
        changeListener(e, selector.r, result)
      );
    }
    return result;
  }

  /* Get a span element containing a label and a select element.
   * Use the select element's ID to make the span's ID.
   */
  private getPair(
    selectId: Sels,
    labelText: string,
    changeListener: ChangeListenerFunction
  ): HTMLSpanElement {
    const spanId = `${selectId.r}-pair`;
    let result = this.querySelector(`span#${spanId}`) as HTMLSpanElement;
    if (!result) {
      result = document.createElement("span");
      result.setAttribute("id", spanId);
      result.classList.add("controls-pair");
      result.append(
        this.getLabel(selectId, labelText),
        this.getSelect(selectId, changeListener)
      );
    }
    return result;
  }

  /* Lay out the child elements.
   */
  private layoutIdempotently() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.append(
      this.titleBoard,
      this.controls,
      this.debugPair,
      this.getPair(Slctr.Keymap, "Keymap", this.chooseKeymap),
      this.getPair(Slctr.Layer, "Layer", this.chooseLayer),
      this.getPair(Slctr.Guide, "Guide", this.chooseGuide)
    );
    this.updateAll();
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

  // #endregion

  // #region Private helpers

  /* Apply or remove the 'hidden' class to an element
   */
  private showHideElement(element: Element, show: boolean) {
    const elemId = element.getAttribute("id");
    if (show && element.classList.contains("hidden")) {
      element.classList.remove("hidden");
      console.trace(`showing (ID ${elemId})`, element);
    } else if (!show && !element.classList.contains("hidden")) {
      element.classList.add("hidden");
      console.trace(`hiding (ID ${elemId})`, element);
    }
  }

  // #endregion
}

// #endregion
