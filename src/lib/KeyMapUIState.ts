/* A state object to pass to all KeyMapUI children.
 *
 * A single source of truth for the UI state of the keymap.
 * Use the observer pattern to notify relevant components when the state changes.
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

import { IStateObserver } from "./State";
import { ConnectionPair } from "./keyConnections";

/* An object representing the state of the entire KeyMapUI.
 *
 * A single source of truth for the UI state of the keymap.
 *
 * Each mutable state property must implement a setter which calls notify().
 * This manual requirement is a bit cumbersome,
 * but it makes state that affects other state much easier to implement
 * (as well as explicit and easy to find).
 *
 * Observers will be notified of all changes to the state object;
 * they should filter based on the keys they're interested in.
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
    oldValue: KeyMapUIStateValue,
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
    this._debug = value;
    this.notify("debug", this._debug, value);
  }

  /* Connections to draw on the diagram
   */
  private _connectionPairs: ConnectionPair[] = [];
  public get connectionPairs(): ConnectionPair[] {
    return this._connectionPairs;
  }
  public set connectionPairs(value: ConnectionPair[]) {
    this._connectionPairs = value;
    this.notify("connectionPairs", this._connectionPairs, value);
  }

  /* The registered name for the keyboard element
   */
  private _keyboardElementName: string = "key-board-title-screen";
  public get keyboardElementName(): string {
    return this._keyboardElementName;
  }
  public set keyboardElementName(value: string) {
    this._keyboardElementName = value;
    this.notify("keyboardElementName", this._keyboardElementName, value);
  }

  /* The ID of the keymap
   */
  private _keymapId: string = "blank";
  public get keymapId(): string {
    return this._keymapId;
  }
  public set keymapId(value: string) {
    this._keymapId = value;
    this.notify("keymapId", this._keymapId, value);
  }

  /* The ID of the layer
   */
  private _layer: number = 0;
  public get layer(): number {
    return this._layer;
  }
  public set layer(value: number) {
    this._layer = value;
    this.notify("layer", this._layer, value);
  }

  /* The ID of the selected key
   */
  private _selectedKey: string = "";
  public get selectedKey(): string {
    return this._selectedKey;
  }
  public set selectedKey(value: string) {
    this._selectedKey = value;
    this.notify("selectedKey", this._selectedKey, value);
  }

  /* If nonempty, any query parameters prefixed with this string will be used to set state
   */
  private _queryPrefix: string = "";
  public get queryPrefix(): string {
    return this._queryPrefix;
  }
  public set queryPrefix(value: string) {
    this._queryPrefix = value;
    this.notify("queryPrefix", this._queryPrefix, value);
  }
}

type KeyMapUIStateValue = KeyMapUIState[keyof KeyMapUIState];
