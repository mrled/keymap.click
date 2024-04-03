/* A state object to pass to all KeyMapUI children.
 *
 * A single source of truth for the UI state of the keymap.
 * Use the observer pattern to notify relevant components when the state changes.
 *
 * We expect the root application componeent - KeyMapUI, in this case -
 * to create an instance of this class and pass it to all children.
 *
 * The root application component should do something like:
 *  constructor() {
 *    // ...
 *    this.state = new StateProvider(new KeyMapUIState());
 *    this.state.setState("initialized", true);
 *    this.state.attach(this);
 *
 * The root application componen should also implement the IStateObserver interface:
 *  update<T extends keyof KeyMapUIState>(key: T, oldValue: KeyMapUIState[T], newValue: KeyMapUIState[T]) {
 *    switch (key) {
 *      doWhateverNeedsDoing();
 *      // ...
 *
 * When creating children which need to observe the state object,
 * the root component should check if they're initialized,
 * and if not, assume that that means they don't have a reference to global state.
 *  private _child: ChildElementType | null = null;
 *  get child(): ChileElementType {
 *    if (!this._child) {
 *      this._child = document.createElement("child-element");
 *      this.appendChild(this._child);
 *    }
 *    if (!this._child.state.getState("initialized")) {
 *      this._child.state = this.state;
 *      this._child.state.attach(this._child);
 *    }
 *    return this._child;
 *  }
 *
 * Finally, the children that need to observe state should also implement IStateObserver.
 *
 * (Children can define a default state object with initialized=false,
 * and the KeyMapUI will know to set the global state object on them.
 * This keeps each child from having to check if its state object is null and makes typing simpler.)
 */

import { KeyboardModelTitleScreen } from "~/webcomponents/key-board-title-screen";
import { KeyBoardModel } from "./KeyboardModel";
import { ConnectionPair } from "./keyConnections";
import { KeyMap } from "./keyMap";

/* An object representing the state of the entire KeyMapUI.
 *
 * Setters are responsible for notifying the provider of changes to any dependents of the state,
 * meaning for instance if the selectedX property changes based on the xName property,
 * the xName setter should call this.provider.notify("selectedX", oldX, newX).
 */
export class KeyMapUIState {
  constructor(public provider: KeyMapUIStateProvider) {}

  // Only the key-map-ui component should ever set this.
  // It allows us to define state objects on every component that needs one,
  // and the key-map-ui will know that any with initialized=false
  // have not been set to the global state object yet.
  public initialized: boolean = false;

  // Debug level
  public debug: number = 0;

  // Connections to draw on the diagram
  public connectionPairs: ConnectionPair[] = [];

  // The name of the keyboard
  private _keyboardElementName: string = "key-board-title-screen";
  public get keyboardElementName(): string {
    return this._keyboardElementName;
  }
  public set keyboardElementName(value: string) {
    if (!customElements.get(value)) {
      throw new Error(
        `KeyMapUI: Keyboard element "${value}" not found - has it been defined with customElements.define(), or if using a library, imported and registered?`
      );
    }

    const foundKeyboard = this.keyboardModels.find(
      (model) => model.keyboardElementName === this.keyboardElementName
    );
    if (!foundKeyboard) {
      throw new Error(`Unknown keyboard element name: ${value}`);
    }

    // Add the keyboard's blank map to our keymaps if it's not already there
    let updateKeymaps = false;
    if (!this.keymaps.has(value)) {
      updateKeymaps = true;
      this.keymaps.set(value, new Map());
    }
    const blankMap = foundKeyboard.blankKeyMap;
    if (!this.keymaps.get(value)?.has(blankMap.uniqueId)) {
      this.keymaps.get(value)?.set(blankMap.uniqueId, blankMap);
    }

    // TODO: use attribute if possible?
    // When state was handled by KeyMapUI,
    // we tracked whether the keymap-id attribute was valid for the new keyboard,
    // and if so, used that.
    // That is nice for the user --
    // changing keyboard from the default to something else then back to the default
    // would load the default keyboard's default keymap.
    // After moving state to a separate class, we don't have direct access to the element's attributes.
    // Is there something we can do instead?

    const oldKeyboardModel = this.keyboardModel;
    this._keyboardElementName = value;
    this.notify("keyboardModel", oldKeyboardModel, this.keyboardModel);
    if (updateKeymaps) {
      // TODO: this doesn't send the old value, need to deep copy the old value
      this.notify("keymaps", this.keymaps, this.keymaps);
    }
  }

  // The ID of the keymap
  public keymapId: string = "blank";

  // The ID of the layer
  public layer: number = 0;

  // The ID of the selected key
  public selectedKey: string = "";

  // If nonempty, any query parameters prefixed with this string will be used to set state
  public queryPrefix: string = "";

  // The keyboard models available to the KeyMapUI
  public keyboardModels: KeyBoardModel[] = [KeyboardModelTitleScreen];
  public get keyboardModel(): KeyBoardModel {
    return (
      this.keyboardModels.find(
        (model) => model.keyboardElementName === this.keyboardElementName
      ) || KeyboardModelTitleScreen
    );
  }

  // The keymaps available to the KeyMapUI
  private _keymaps: Map<string, Map<string, KeyMap>> = new Map([
    [
      KeyboardModelTitleScreen.keyboardElementName,
      new Map<string, KeyMap>([
        [
          KeyboardModelTitleScreen.blankKeyMap.uniqueId,
          KeyboardModelTitleScreen.blankKeyMap,
        ],
      ]),
    ],
  ]);
  public get keymaps(): Map<string, Map<string, KeyMap>> {
    return this._keymaps;
  }
  public set keymaps(value: Map<string, Map<string, KeyMap>>) {
    this._keymaps = value;
  }

  // The currently selected keymap
  public get keymap(): KeyMap {
    const keymapsForCurrentKeyboard = this.keymaps.get(
      this.keyboardElementName
    );
    if (!keymapsForCurrentKeyboard) {
      this._keyboardElementName = KeyboardModelTitleScreen.keyboardElementName;
      return KeyboardModelTitleScreen.blankKeyMap;
    }
    return (
      keymapsForCurrentKeyboard.get(this.keymapId) ||
      KeyboardModelTitleScreen.blankKeyMap
    );
  }

  /* Notify the provider of a change to the state.
   */
  private notify<K extends keyof KeyMapUIState>(
    key: K,
    oldValue: KeyMapUIState[K],
    newValue: KeyMapUIState[K]
  ) {
    this.provider.notify(key, oldValue, newValue);
  }
}

/* A state provider interface
 *
 * The state provider is responsible for managing state observers and notifying them of changes.
 */
export interface IStateProvider<T> {
  attach(observer: IStateObserver<T>): void;
  detach(observer: IStateObserver<T>): void;
  notify(changedKey: keyof T, oldValue: T[keyof T], newValue: T[keyof T]): void;
}

/* A state observer interface
 *
 * The state observer is responsible for updating its view when the state changes.
 */
export interface IStateObserver<T> {
  update(key: keyof T, oldValue: T[keyof T], newValue: T[keyof T]): void;
}

type KeyMapUIStateValue = KeyMapUIState[keyof KeyMapUIState];

/* A state provider class
 *
 * The state provider is responsible for managing state observers and notifying them of changes.
 */
export class KeyMapUIStateProvider implements IStateProvider<KeyMapUIState> {
  private observers: IStateObserver<KeyMapUIState>[] = [];
  private state: KeyMapUIState;

  constructor(initialState?: KeyMapUIState | null) {
    if (!initialState) {
      this.state = new KeyMapUIState(this);
    } else {
      this.state = initialState;
      this.state.provider = this;
    }
  }

  attach(observer: IStateObserver<KeyMapUIState>): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }

  detach(observer: IStateObserver<KeyMapUIState>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  notify(
    changedKey: keyof KeyMapUIState,
    oldValue: KeyMapUIStateValue,
    newValue: KeyMapUIStateValue
  ): void {
    for (const observer of this.observers) {
      observer.update(changedKey, oldValue, newValue);
    }
  }

  setState<K extends keyof KeyMapUIState>(
    key: K,
    newValue: KeyMapUIState[K]
  ): void {
    if (this.state[key] === newValue) {
      // Don't notify observers if the value hasn't changed;
      // this is faster but more importantly avoids infinite loops.
      return;
    }
    const oldValue = this.state[key];
    this.state[key] = newValue;
    this.notify(key, oldValue, newValue);
  }

  getState<K extends keyof KeyMapUIState>(key: K): KeyMapUIState[K] {
    return this.state[key];
  }

  /* Read the query string and update the state of the KeyMapUI.
   */
  setStateFromQueryString() {
    const queryPrefix = this.getState("queryPrefix");

    if (!queryPrefix) {
      return;
    }
    const currentParams = new URLSearchParams(window.location.search);

    const qBoard = currentParams.get(`${queryPrefix}-board`);
    const qMap = currentParams.get(`${queryPrefix}-map`);
    const qLayer = currentParams.get(`${queryPrefix}-layer`);
    const qKey = currentParams.get(`${queryPrefix}-key`);

    if (qBoard) this.setState("keyboardElementName", qBoard);
    if (qMap) this.setState("keymapId", qMap);
    if (qLayer) this.setState("layer", parseInt(qLayer, 10));
    if (qKey) this.setState("selectedKey", qKey);
  }

  /* Set the query string based on the current state.
   *
   * This is called whenever one of the queryable attributes changes.
   * It does not affect any query parameters other than those with the query prefix.
   *
   * If any of the query parameters match the attributes on the element in the DOM,
   * they are removed from the query string.
   * This means the query string overrides the attributes on the element,
   * and the URL isn't cluttered with unnecessary query parameters.
   *
   * This function doesn't handle changes to the query prefix itself;
   * that is handled by #updateQueryPrefix().
   *
   * Requires the element to be passed in so we can get the current attribute values.
   */
  setQueryStringFromState(element: HTMLElement) {
    const queryPrefix = this.getState("queryPrefix");

    if (!queryPrefix) {
      return;
    }
    const newParams = new URLSearchParams(window.location.search);

    const tBoardElement = this.getState("keyboardElementName");
    const tMap = this.getState("keymapId");
    const tLayer = this.getState("layer");
    const tKey = this.getState("selectedKey");

    const aBoardElement = element.getAttribute("keyboard-element") || "";
    const aMap = element.getAttribute("keymap-id") || "";
    const aLayer = parseInt(element.getAttribute("layer") || "0", 10);
    const aKey = element.getAttribute("selected-key") || "";

    if (tBoardElement && aBoardElement !== tBoardElement) {
      newParams.set(`${queryPrefix}-board`, tBoardElement);
    } else {
      newParams.delete(`${queryPrefix}-board`);
    }

    if (tMap && aMap !== tMap) {
      newParams.set(`${queryPrefix}-map`, tMap);
    } else {
      newParams.delete(`${queryPrefix}-map`);
    }

    if (tLayer && aLayer !== tLayer) {
      newParams.set(`${queryPrefix}-layer`, tLayer.toString());
    } else {
      newParams.delete(`${queryPrefix}-layer`);
    }

    if (tKey && aKey !== tKey) {
      newParams.set(`${queryPrefix}-key`, tKey);
    } else {
      newParams.delete(`${queryPrefix}-key`);
    }

    const newUrl =
      newParams.toString() !== ""
        ? `${window.location.pathname}?${newParams.toString()}`
        : `${window.location.pathname}`;

    if (window.location.search !== `?${newUrl}`) {
      window.history.replaceState({}, "", newUrl);
    }
  }
}
