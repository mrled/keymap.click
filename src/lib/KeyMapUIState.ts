/* A state object to pass to all KeyMapUI children.
 *
 * A single source of truth for the UI state of the keymap.
 * Use the observer pattern to notify relevant components when the state changes.
 *
 * We expect that state is immutable.
 * When a component needs to change state, it should create a new object.
 *
 * We expect the root application component - KeyMapUI, in this case -
 * to create an instance of this class and pass it to all children.
 *
 * The root application component should do something like:
 *  constructor() {
 *    // ...
 *    this.state = new KeyMapUIState()
 *    this.state.initialized = true;
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
 *    if (!this._child.state.initialized) {
 *      this._child.state = this.state;
 *    }
 *    return this._child;
 *  }
 *
 * Finally, the children that need to observe state should implement a setter for their state object
 * that attaches to the state automatically when set,
 * and also the IStateObserver interface.
 *  class WhateverElement
 *    extends HTMLElement
 *    implements IStateObserver<KeyMapUIState>
 *  {
 *    private _state = new KeyMapUIState();
 *    get state() { return this._state; }
 *    set state(value: KeyMapUIState) {
 *      this._state = value;
 *      this._state.attach(this);
 *      this.someChildElement.state = value; // Can also set state for children here, if applicable
 *      this.updateEverything(); // or whatever
 *    }
 *
 * (Children can define a default state object with initialized=false,
 * and the KeyMapUI will know to set the global state object on them.
 * This keeps each child from having to check if its state object is null and makes typing simpler.)
 */

import { KeyBoard } from "~/webcomponents/key-board";
import { KeyBoardModel } from "./KeyboardModel";
import { IStateObserver } from "./State";
import { ConnectionPair } from "./keyConnections";
import { KeyMap } from "./keyMap";
import { Key } from "readline";

/* A map of uniqueID strings to KeyMap objects
 */
export type KeymapMap = Map<string, KeyMap>;

/* A map of keyboard element names to KeyMapMap objects
 */
export type KeyboardKeymapMapMap = Map<string, KeymapMap>;

/* An object representing the state of the entire KeyMapUI.
 *
 * A single source of truth for the UI state of the keymap.
 *
 * State properties must be implemented as getters and setters,
 * and there are some special requirements for setters.
 * 1. They must check if the value is actually changed before running --
 *    especially before calling notify() -- to avoid infinite loops.
 *    This means that state properties must be immutable,
 *    as modifying a property in place will not trigger observers.
 * 2. They must call notify() with the key that changed.
 *    This is so that observers can filter on the keys they're interested in.
 *    This is a bit cumbersome, but it makes state that affects other state much easier to implement.
 *
 * Observers will be notified of all changes to the state object;
 * they should filter based on the keys they're interested in.
 *
 * Some things to worry about:
 *  - If a private store for a state property has a default value,
 *    then setting it explicitly to the default value will not trigger an update.
 *    For example:
 *      private _xyz: number = 0;
 *    To work around this, set the private store to null and check for null in the getter.
 *    For example:
 *      private _xyz: number | null = null;
 *      public get xyz(): number {
 *        return this._xyz ?? 0;
 *      }
 *    This will only cause a problem for properties that should trigger an update when set to the default value.
 *    For instance, we have a default keyboard model/map that are kind of placeholders,
 *    but if they are set explicitly then we still need to trigger an update to the KeyMapUI
 *    so that it knows its keyboard model/map have ever been set.
 */
export class KeyMapUIState {
  constructor() {}

  //
  // State observation
  //

  /* A list of observers
   */
  private observers: IStateObserver<KeyMapUIState>[] = [];

  /* Attach an observer
   */
  attach(observer: IStateObserver<KeyMapUIState>): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }

  /* Detach an observer
   */
  detach(observer: IStateObserver<KeyMapUIState>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  /* Notify all observers of a change
   */
  notify(
    changedKey: keyof KeyMapUIState,
    oldValue: KeyMapUIStateValue | null,
    newValue: KeyMapUIStateValue
  ): void {
    for (const observer of this.observers) {
      observer.update(changedKey, oldValue, newValue);
    }
  }

  // #region State data

  /* Only the key-map-ui component should ever set this.
   * It allows us to define state objects on every component that needs one,
   * and the key-map-ui will know that any with initialized=false
   * have not been set to the global state object yet.
   */
  public initialized: boolean = false;

  /* Debug level
   */
  private _debug: number = 0;
  public get debug(): number {
    return this._debug;
  }
  public set debug(value: number) {
    if (this._debug === value) return;
    const oldValue = this._debug;
    this._debug = value;
    this.notify("debug", oldValue, value);
  }

  /* If nonempty, any query parameters prefixed with this string will be used to set state
   */
  private _queryPrefix: string = "";
  public get queryPrefix(): string {
    return this._queryPrefix;
  }
  public set queryPrefix(value: string) {
    if (this._queryPrefix === value) return;
    const oldValue = this._queryPrefix;
    this._queryPrefix = value;
    this.notify("queryPrefix", oldValue, value);
  }

  /* All the keyboard models we know about
   */
  private _kbModels: KeyBoardModel[] = [];
  public get kbModels(): KeyBoardModel[] {
    return this._kbModels;
  }
  public set kbModels(value: KeyBoardModel[]) {
    if (this._kbModels === value) return;
    const oldValue = this._kbModels;
    this._kbModels = value;
    const oldKeymap = this._keymap;
    this._keymap = this.kbModel.blankKeyMap;
    this.notify("kbModels", oldValue, value);
    this.notify("keymap", oldKeymap, this._keymap);
  }

  /* The current keyboard model
   */
  private _kbModel: KeyBoardModel | null = null;
  public get kbModel(): KeyBoardModel {
    if (this._kbModel === null) {
      this._kbModel = new KeyBoardModel("key-board-title-screen");
    }
    return this._kbModel;
  }
  public set kbModel(value: KeyBoardModel) {
    if (this._kbModel === value) return;
    const oldValue = this._kbModel;
    const oldKeymap = this._keymap;
    const oldSelectedKey = this._selectedKey;
    this._kbModel = value;
    if (!this.kbModels.includes(value)) {
      this.kbModels.push(value);
    }

    // When switching models, it doesn't make sense to keep the same key selected.
    if (oldSelectedKey) {
      this._selectedKey = "";
      this.notify("selectedKey", oldSelectedKey, this.selectedKey);
    }

    // If we're switching models, we need to switch keymaps too.
    // Set the private backing keymap property here without notifying observers.
    // Find a non-blank keymap if possible, or fall back to the blank one.
    if (oldKeymap) {
      const nonBlankKeymap = Array.from(
        this.keymaps.get(value.keyboardElementName)?.values() || []
      ).filter((km) => km !== value.blankKeyMap)[0];
      this._keymap = nonBlankKeymap ? nonBlankKeymap : value.blankKeyMap;
      console.log(`Just set new keymap to: ${this._keymap.uniqueId}`);
    }

    // Notify observers of the model change first.
    // Observers that need to listen for BOTH kbModel and keymap should listen just to kbmodel,
    // and query the current keymap from the state every time,
    // which will work here because the private backing keymap property was set above.
    // This feels kind of hacky, but it makes sense because the keymap is dependent on the model.
    this.notify("kbModel", oldValue, value);

    // Now notify observers of the keymap change.
    // Observers that only care about the keymap change can listen only to that.
    if (oldKeymap) {
      this.notify("keymap", oldKeymap, this.keymap);
    }
  }

  /* All keymaps that we know about
   */
  private _keymaps: KeyboardKeymapMapMap = new Map();
  public get keymaps(): KeyboardKeymapMapMap {
    return this._keymaps;
  }
  public set keymaps(value: KeyboardKeymapMapMap) {
    if (this._keymaps === value) return;
    const oldValue = this._keymaps;
    this._keymaps = value;
    // Add each model
    value.forEach((keymaps, kbName) => {
      keymaps.forEach((keymap, keymapId) => {
        if (!this.kbModels.includes(keymap.model)) {
          this.kbModels.push(keymap.model);
        }
      });
    });
    // Add a blank keymap for each model
    this.#idempotentlyAddBlankKeyMap(this.kbModel.keyboardElementName);
    this.notify("keymaps", oldValue, value);
  }

  /* Just the keymaps for the current keyboard model
   *
   * Note that this is NOT observable state, but a simple convenience getter;
   * observers should listen for changes to the keymaps property instead.
   */
  public get boardMaps(): KeymapMap {
    if (!this.kbModel.keyboardElementName) return new Map();
    return this.keymaps.get(this.kbModel.keyboardElementName) || new Map();
  }

  /* The selected keymap, among the known keymaps
   */
  private _keymap: KeyMap | null = null;
  get keymap(): KeyMap {
    if (this._keymap === null) {
      this._keymap = this.kbModel.blankKeyMap;
    }
    return this._keymap;
  }
  set keymap(value: KeyMap) {
    if (this._keymap === value) return;
    const oldValue = this._keymap;
    const oldSelectedKey = this._selectedKey;
    this._keymap = value;
    if (oldSelectedKey) {
      this.selectedKey = "";
      this.notify("selectedKey", oldSelectedKey, this.selectedKey);
    }
    this.notify("keymap", oldValue, value);
  }

  /* The ID of the current layer
   */
  private _layer: number = 0;
  public get layer(): number {
    return this._layer;
  }
  public set layer(value: number) {
    if (this._layer === value) return;
    const oldValue = this._layer;
    const oldSelectedKey = this._selectedKey;
    this._layer = value;
    if (oldSelectedKey) {
      this.selectedKey = "";
      this.notify("selectedKey", oldSelectedKey, this.selectedKey);
    }
    this.notify("layer", oldValue, value);
  }

  /* The ID of the current guide, if any
   */
  private _guide: string = "";
  public get guide(): string {
    return this._guide;
  }
  public set guide(value: string) {
    if (this._guide === value) return;
    const oldValue = this._guide;
    const oldSelectedKey = this._selectedKey;
    this._guide = value;
    if (oldSelectedKey) {
      this.selectedKey = "";
      this.notify("selectedKey", oldSelectedKey, this.selectedKey);
    }
    this.notify("guide", oldValue, value);
  }

  /* The ID of the selected key
   */
  private _selectedKey: string = "";
  public get selectedKey(): string {
    return this._selectedKey;
  }
  public set selectedKey(value: string) {
    if (this._selectedKey === value) return;
    const oldValue = this._selectedKey;
    this._selectedKey = value;
    this.notify("selectedKey", oldValue, value);
  }

  /* Connections to draw on the diagram
   */
  private _connectionPairs: ConnectionPair[] = [];
  public get connectionPairs(): ConnectionPair[] {
    return this._connectionPairs;
  }
  public set connectionPairs(value: ConnectionPair[]) {
    if (this._connectionPairs === value) return;
    const oldValue = this._connectionPairs;
    this._connectionPairs = value;
    this.notify("connectionPairs", oldValue, value);
  }

  //
  // Other private methods
  //

  /* Idempotently add a blank keymap to our set of known keymaps
   */
  #idempotentlyAddBlankKeyMap(kbName: string) {
    const kbElemConstructor = customElements.get(kbName);
    if (!kbElemConstructor) {
      return;
    }
    // TODO: this is a hack to get to instance properties, can I do something else?
    const tmpInstance = new kbElemConstructor() as KeyBoard;
    if (!this.keymaps.has(kbName)) {
      this.keymaps.set(kbName, new Map());
    }
    const boardKeyMaps = this.keymaps.get(kbName)!;
    const blankKeyMap = tmpInstance.model.blankKeyMap;
    boardKeyMaps.set(blankKeyMap.uniqueId, blankKeyMap);
  }
}

type KeyMapUIStateValue = KeyMapUIState[keyof KeyMapUIState];
