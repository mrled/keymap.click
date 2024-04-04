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

import { KeyBoard } from "~/webcomponents/key-board";
import { KeyBoardModel } from "./KeyboardModel";
import { IStateObserver } from "./State";
import { ConnectionPair } from "./keyConnections";
import { KeyMap } from "./keyMap";

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

  //
  // State data
  //

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
    this.notify("kbModels", oldValue, value);
  }

  /* The current keyboard model
   */
  private _kbModel: KeyBoardModel = new KeyBoardModel(this.keyboardElementName);
  public get kbModel(): KeyBoardModel {
    return this._kbModel;
  }
  public set kbModel(value: KeyBoardModel) {
    if (this._kbModel === value) return;
    const oldValue = this._kbModel;
    this._kbModel = value;
    if (!this.kbModels.includes(value)) {
      this.kbModels.push(value);
    }
    this.notify("kbModel", oldValue, value);
  }

  /* The registered element name for the keyboard element
   */
  private _keyboardElementName: string | null = null;
  public get keyboardElementName(): string {
    if (!this._keyboardElementName) {
      this._keyboardElementName = "key-board-title-screen";
    }
    return this._keyboardElementName;
  }
  public set keyboardElementName(value: string) {
    if (this._keyboardElementName === value) return;
    if (!customElements.get(value)) {
      console.error(`KeyMapUI: Keyboard element "${value}" not found - has it been defined with customElements.define(), or if using a library, imported
      and registered?`);
      return;
      // } else if (!this._keyboards.includes(value)) {
      //   console.error(
      //     `KeyMapUI: Keyboard element "${value}" not found in the list of available keyboards (${this._keyboards.join()})`
      //   );
      //   return;
    }
    const oldValue = this._keyboardElementName;
    this._keyboardElementName = value;

    // TODO: use attribute if possible?
    // When state was handled by KeyMapUI,
    // we tracked whether the keymap-id attribute was valid for the new keyboard,
    // and if so, used that.
    // That is nice for the user --
    // changing keyboard from the default to something else then back to the default
    // would load the default keyboard's default keymap.
    // After moving state to a separate class, we don't have direct access to the element's attributes.
    // Is there something we can do instead?
    this.keymapId = "blank";

    this.notify("keyboardElementName", oldValue, value);
  }

  /* All keymaps that we know about
   */
  private _keymaps: Map<string, Map<string, KeyMap>> = new Map();
  public get keymaps(): Map<string, Map<string, KeyMap>> {
    return this._keymaps;
  }
  public set keymaps(value: Map<string, Map<string, KeyMap>>) {
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
    this.#idempotentlyAddBlankKeyMap(this.keyboardElementName);
    this.notify("keymaps", oldValue, value);
  }

  /* The ID of the selected keymap
   */
  private _keymapId: string | null = null;
  public get keymapId(): string {
    if (this._keymapId === null) {
      this._keymapId = this.kbModel.blankKeyMap.uniqueId;
    }
    return this._keymapId;
  }
  public set keymapId(value: string) {
    if (this._keymapId === value) return;
    const oldValue = this._keymapId;
    this._keymapId = value;
    this.notify("keymapId", oldValue, value);
  }

  /* The selected keymap, among the known keymaps
   */
  get keymap(): KeyMap {
    return (
      this.keymaps.get(this.keyboardElementName)?.get(this.keymapId) ||
      this.kbModel.blankKeyMap
    );
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
    this._layer = value;
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
    this._guide = value;
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
