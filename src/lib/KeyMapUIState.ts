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
 *  update<T extends keyof KeyMapUIState>(key: T, value: KeyMapUIState[T]) {
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

import { ConnectionPair } from "./keyConnections";

/* An object representing the state of the entire KeyMapUI.
 */
export class KeyMapUIState {
  constructor(
    // Only the key-map-ui component should ever set this.
    // It allows us to define state objects on every component that needs one,
    // and the key-map-ui will know that any with initialized=false
    // have not been set to the global state object yet.
    public initialized: boolean = false,

    // Debug level
    public debug: number = 0,

    // Connections to draw on the diagram
    public connectionPairs: ConnectionPair[] = []
  ) {}
}

/* A state provider interface
 *
 * The state provider is responsible for managing state observers and notifying them of changes.
 */
export interface IStateProvider<T> {
  attach(observer: IStateObserver<T>): void;
  detach(observer: IStateObserver<T>): void;
  notify(changedKey: keyof T, newValue: T[keyof T]): void;
}

/* A state observer interface
 *
 * The state observer is responsible for updating its view when the state changes.
 */
export interface IStateObserver<T> {
  update(key: keyof T, value: T[keyof T]): void;
}

/* A state provider class
 *
 * The state provider is responsible for managing state observers and notifying them of changes.
 */
export class StateProvider<T> implements IStateProvider<T> {
  private observers: IStateObserver<T>[] = [];
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  attach(observer: IStateObserver<T>): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }

  detach(observer: IStateObserver<T>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  notify(changedKey: keyof T, newValue: T[keyof T]): void {
    for (const observer of this.observers) {
      observer.update(changedKey, newValue);
    }
  }

  setState<K extends keyof T>(key: K, value: T[K]): void {
    this.state[key] = value;
    this.notify(key, value);
  }

  getState<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }
}
