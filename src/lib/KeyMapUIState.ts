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
import { IStateObserver, StateChange, StateChangeMap } from "./State";
import { ConnectionPair } from "./keyConnections";
import { KeyMap, KeyMapGuide, KeyMapLayer } from "./keyMap";
import { KeyMapTitleScreen } from "./keyMaps/KeyMapTitleScreen";
import { KeyboardModelTitleScreen } from "~/webcomponents/key-board-title-screen";

/* A map of uniqueID strings to KeyMap objects
 */
export type KeymapMap = Map<string, KeyMap>;

/* A map of keyboard element names to KeyMapMap objects
 */
export type KeyboardKeymapMapMap = Map<string, KeymapMap>;

/* A non-generic state change
 */
export class KeyMapUIStateChange extends StateChange<KeyMapUIState> {}

/* A non-generic map of key:KeyMapUIStateChange
 */
export class KeyMapUIStateChangeMap extends Map<string, KeyMapUIStateChange> {}

/* Arguments that can be passed to setMultiStateByIdsInSingleTransaction
 */
export interface IKeyMapUIStateIdArgs {
  debug?: number;
  queryPrefix?: string;
  keyboardElementName?: string;
  keymapId?: string;
  layerIdx?: number;
  guideId?: string;
  selectedKey?: string;
}

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

  /* Notify all observers of a set of changes
   */
  notify(stateChanges: StateChange<KeyMapUIState>[]): void {
    const stateChangeMap = new KeyMapUIStateChangeMap(
      stateChanges.map((change) => [change.key, change])
    );
    for (const observer of this.observers) {
      observer.update(stateChangeMap as StateChangeMap<KeyMapUIState>);
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
    this.notify([new StateChange("debug", oldValue, value)]);
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
    this.notify([new StateChange("queryPrefix", oldValue, value)]);
  }

  /* All the keyboard models we know about
   */
  private _kbModels: KeyBoardModel[] | null = null;
  public get kbModels(): KeyBoardModel[] {
    if (this._kbModels === null) {
      this._kbModels = [KeyboardModelTitleScreen];
    }
    return this._kbModels;
  }
  public set kbModels(value: KeyBoardModel[]) {
    if (this._kbModels === value) return;
    const oldValue = this._kbModels;
    this._kbModels = value;
    const oldKeymap = this._keymap;
    this._keymap = this.kbModel.blankKeyMap;
    const stateChanges = [new KeyMapUIStateChange("kbModels", oldValue, value)];
    if (oldKeymap !== this._keymap) {
      stateChanges.push(
        new KeyMapUIStateChange("keymap", oldKeymap, this._keymap)
      );
    }
    this.notify(stateChanges);
  }

  /* The current keyboard model
   */
  private _kbModel: KeyBoardModel | null = null;
  public get kbModel(): KeyBoardModel {
    if (this._kbModel === null) {
      this._kbModel = this.kbModels[0];
    }
    return this._kbModel;
  }
  public set kbModel(value: KeyBoardModel) {
    if (this._kbModel === value) return;
    const oldValue = this._kbModel;
    const oldKeymap = this._keymap;
    const oldLayer = this._layer;
    const oldSelectedKey = this._selectedKey;
    this._kbModel = value;
    if (!this.kbModels.includes(value)) {
      this.kbModels.push(value);
    }

    // When switching models, it doesn't make sense to keep the same key selected.
    this._selectedKey = "";

    // If we're switching models, we need to switch keymaps too.
    // Set the private backing keymap property here without notifying observers.
    // Find a non-blank keymap if possible, or fall back to the blank one.
    const nonBlankKeymap = Array.from(
      this.keymaps.get(value.keyboardElementName)?.values() || []
    ).filter((km) => km !== value.blankKeyMap)[0];
    this._keymap = nonBlankKeymap ? nonBlankKeymap : value.blankKeyMap;

    // If we're switching models, we need to switch layers too.
    this._layer = this.keymap.layers[0];

    const stateChanges = [
      new KeyMapUIStateChange("kbModel", oldValue, value),
      new KeyMapUIStateChange("keymap", oldKeymap, this._keymap),
      new KeyMapUIStateChange("layer", oldLayer, this._layer),
    ];
    if (oldSelectedKey) {
      stateChanges.push(
        new KeyMapUIStateChange("selectedKey", oldSelectedKey, this.selectedKey)
      );
    }
    this.notify(stateChanges);
  }

  /* All keymaps that we know about
   */
  private _keymaps: KeyboardKeymapMapMap | null = null;
  public get keymaps(): KeyboardKeymapMapMap {
    // Initialize with the blank keymap and the title screen keymap for the title screen kbModel.
    if (this._keymaps === null) {
      this._keymaps = new Map();
      this._keymaps.set(this.kbModel.keyboardElementName, new Map());
      const boardMaps = this._keymaps.get(this.kbModel.keyboardElementName)!;
      boardMaps.set(
        this.kbModel.blankKeyMap.uniqueId,
        this.kbModel.blankKeyMap
      );
      boardMaps.set(KeyMapTitleScreen.uniqueId, KeyMapTitleScreen);
    }
    return this._keymaps;
  }
  public set keymaps(value: KeyboardKeymapMapMap) {
    // This setter doesn't ensure that the title screen keymap is present.
    if (this._keymaps === value) return;
    const oldValue = this._keymaps;
    this._keymaps = value;
    // Add each model
    const knownBoardModels = this.kbModels.map((m) => m.keyboardElementName);
    value.forEach((keymaps, kbName) => {
      keymaps.forEach((keymap, keymapId) => {
        if (!knownBoardModels.includes(kbName)) {
          this.kbModels.push(keymap.model);
          knownBoardModels.push(kbName);
        }
      });
    });
    // Add a blank keymap for each model
    this.#idempotentlyAddBlankKeyMap(this.kbModel.keyboardElementName);
    this.notify([new KeyMapUIStateChange("keymaps", oldValue, value)]);
  }

  /* Just the keymaps for the current keyboard model
   *
   * Note that this is NOT observable state, but a simple convenience getter;
   * observers should listen for changes to the keymaps property instead.
   */
  public get boardMaps(): KeymapMap {
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
    const oldLayer = this._layer;
    this._keymap = value;
    this._selectedKey = "";
    this._layer = value.layers[0];

    const changes = [
      new KeyMapUIStateChange("keymap", oldValue, value),
      new KeyMapUIStateChange("layer", oldLayer, this._layer),
    ];
    if (oldSelectedKey) {
      changes.push(
        new KeyMapUIStateChange("selectedKey", oldSelectedKey, this.selectedKey)
      );
    }
    this.notify(changes);
  }

  /* The ID of the current layer
   */
  private _layer: KeyMapLayer | null = null;
  public get layer(): KeyMapLayer {
    if (this._layer === null) {
      this._layer = this.keymap.layers[0];
    }
    return this._layer;
  }
  public set layer(value: KeyMapLayer) {
    if (this._layer === value) return;
    const oldValue = this._layer;
    const oldSelectedKey = this._selectedKey;
    this._layer = value;
    const changes = [new KeyMapUIStateChange("layer", oldValue, this.layer)];
    if (oldSelectedKey) {
      changes.push(
        new KeyMapUIStateChange("selectedKey", oldSelectedKey, this.selectedKey)
      );
    }
    this.notify(changes);
  }

  /* The ID of the current guide, if any
   */
  private _guide: KeyMapGuide | null = null;
  public get guide(): KeyMapGuide | null {
    return this._guide;
  }
  public set guide(value: KeyMapGuide | null) {
    if (this._guide === value) return;
    const oldValue = this._guide;
    const oldSelectedKey = this._selectedKey;
    this._guide = value;
    const changes = [new KeyMapUIStateChange("guide", oldValue, this.layer)];
    if (oldSelectedKey) {
      changes.push(
        new KeyMapUIStateChange("selectedKey", oldSelectedKey, this.selectedKey)
      );
    }
    this.notify(changes);
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
    this.notify([new KeyMapUIStateChange("selectedKey", oldValue, value)]);
    // TODO: can we handle connectionPairs here too?
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
    this.notify([new KeyMapUIStateChange("connectionPairs", oldValue, value)]);
  }

  // #region Public helpers

  /* Set state all at once by identifiers, perhaps from a query string.
   *
   * Setting state by identifiers means using known object IDs rather than object references.
   * For instance, kbModel is a KeyBoardModel object, but we can set it by its keyboardElementName.
   * The IDs can be encoded in HTML element attribute names or query parameters,
   * while real objects obviously can't.
   *
   * Setting state in a single transaction means that all changes are made at once,
   * and observers are notified only once.
   * This is useful when multiple changes are related and should be treated as a single event.
   * For instance, if we set the kbModel normally, we reset other state properties like the selectedKey,
   * and observers would be notified of each change separately.
   * Worse, observers intending to make multiple changes in a row
   *
   * Trigger a single update for all changes.
   * Handle any effects of one change on another.
   */
  setMultiStateByIdsInSingleTransaction({
    debug,
    queryPrefix,
    keyboardElementName,
    keymapId,
    layerIdx,
    guideId,
    selectedKey,
  }: IKeyMapUIStateIdArgs) {
    //

    // Validate the new state properties.
    // Don't make changes to the state yet.

    if (debug !== undefined) {
      if (debug < 0 || debug > 1) {
        console.error(`Invalid debug level: ${debug}`);
        return;
      }
    }

    const specifiedKbModel = keyboardElementName !== undefined;
    const oldKbModel = this.kbModel;
    let newKbModel: KeyBoardModel | undefined = undefined;
    if (specifiedKbModel) {
      newKbModel = this.kbModels.find(
        (m) => m.keyboardElementName === keyboardElementName
      );
      if (!newKbModel) {
        console.error(
          `No model found for element name: ${keyboardElementName}`
        );
        return;
      }
    } else {
      // If a keyboard wasn't specified, the keyboard will not change.
      newKbModel = this.kbModel;
    }
    const changedKbModel = newKbModel !== oldKbModel;

    const specifiedKeymap = keymapId !== undefined;
    const oldKeymap = this.keymap;
    let newKeymap: KeyMap | undefined = undefined;
    if (specifiedKeymap) {
      newKeymap = Array.from(this.boardMaps.values()).find(
        (km) => km.uniqueId === keymapId
      );
      if (!newKeymap) {
        console.error(`No keymap found for unique ID: ${keymapId}`);
        return;
      }
    } else if (changedKbModel) {
      // If we don't specify a keymap by ID, but the keyboard changed,
      // use the best default map we can find for that keyboard.
      newKeymap = this.#getNonBlankKeyMapIfPossible(
        newKbModel.keyboardElementName
      );
    } else {
      // If a keymap or keyboard were not specified, the keymap will not change.
      newKeymap = this.keymap;
    }
    const changedKeymap = newKeymap !== oldKeymap;

    const specifiedLayer = layerIdx !== undefined;
    const oldLayer = this.layer;
    let newLayer: KeyMapLayer | undefined = undefined;
    if (specifiedLayer) {
      if (layerIdx < 0 || layerIdx >= newKeymap.layers.length) {
        console.error(`Invalid layer index: ${layerIdx}`);
        return;
      }
      newLayer = newKeymap.layers[layerIdx];
    } else if (changedKeymap) {
      // If we don't specify a layer by index, but the keymap changed,
      // use the first layer of the new keymap.
      newLayer = newKeymap.layers[0];
    } else {
      // If a layer, keymap, or keyboard were not specified, the layer will not change.
      newLayer = this.layer;
    }
    // We have to check for a changed keymap (which will also be true if the keyboard changed)
    // because the layer is a value type and layer 0 of one map is not the same as layer 0 of another.
    const changedLayer = newLayer !== oldLayer || changedKeymap;

    const specifiedGuide = guideId !== undefined;
    const oldGuide = this.guide;
    let newGuide: KeyMapGuide | undefined | null = undefined;
    if (specifiedGuide) {
      // A null guide is valid as-is, and means no guide is selected;
      // a non-null guide ID must be validated.
      if (guideId === "") {
        newGuide = null;
      } else {
        newGuide = this.keymap.guides.find((g) => g.id === guideId);
        if (!newGuide) {
          console.error(`No guide found for id: ${guideId} on keymap `);
          return;
        }
      }
    } else if (changedKeymap) {
      // If we don't specify a guide by ID, but the keymap changed,
      // do not enter guide mode.
      newGuide = null;
    } else {
      // If a guide, keymap, or keyboard were not specified, the guide will not change.
      newGuide = this.guide;
    }
    const changedGuide = newGuide !== oldGuide;

    const specifiedSelectedKey = selectedKey !== undefined;
    const oldSelectedKey = this.selectedKey;
    let newSelectedKeyId: string = "";
    if (specifiedSelectedKey) {
      newSelectedKeyId = selectedKey as string;
    } else if (changedKeymap || changedLayer || changedGuide) {
      // If we don't specify a key by ID,
      // but did specify any argument that implies different key functionality,
      // unselect the key.
      newSelectedKeyId = "";
    } else {
      // Otherwise, the selected key will not change.
      newSelectedKeyId = this.selectedKey;
    }
    const changedSelectedKey = newSelectedKeyId !== oldSelectedKey;

    // Now that input is validated, make changes to the state
    const changes: KeyMapUIStateChange[] = [];

    if (debug !== undefined) {
      changes.push(new KeyMapUIStateChange("debug", this.debug, debug));
      this._debug = debug;
    }

    if (queryPrefix !== undefined) {
      changes.push(
        new KeyMapUIStateChange("queryPrefix", this.queryPrefix, queryPrefix)
      );
      this._queryPrefix = queryPrefix;
    }

    if (changedKbModel) {
      changes.push(new KeyMapUIStateChange("kbModel", oldKbModel, newKbModel));
      this._kbModel = newKbModel;
    }

    if (changedKeymap) {
      changes.push(new KeyMapUIStateChange("keymap", oldKeymap, newKeymap));
      this._keymap = newKeymap;
    }

    if (changedLayer) {
      changes.push(new KeyMapUIStateChange("layer", oldLayer, newLayer));
      this._layer = newLayer;
    }

    if (changedGuide) {
      changes.push(new KeyMapUIStateChange("guide", oldGuide, newGuide));
      this._guide = newGuide;
    }

    if (changedSelectedKey) {
      changes.push(
        new KeyMapUIStateChange("selectedKey", oldSelectedKey, newSelectedKeyId)
      );
      this._selectedKey = newSelectedKeyId;
    }

    this.notify(changes);
  }

  /* A helper function to show the current state and query string
   *
   * Parameters:
   * - forceLog: if true, log the state even if debug is off
   * - kmui: the KeyMapUI element, if available
   *   if this is provided and it has an id attribute, that will be included in the log messages
   * - messagePrefix: a string to prepend to the log message
   * - logQueryString: if true (default), log the query string
   */
  logState({
    forceLog = false,
    kmui = undefined,
    messagePrefix = "",
    logQueryString = true,
  }: {
    forceLog?: boolean;
    kmui?: HTMLElement | undefined;
    messagePrefix?: string;
    logQueryString?: boolean;
  }) {
    if (this.debug === 0 && !forceLog) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const qPfx = this.queryPrefix;

    type LogTableRow = {
      prefix: string;
      board: string;
      map: string;
      layer: number;
      key: string;
      info?: string;
    };
    type LogTable = {
      state: LogTableRow;
      attribute?: LogTableRow;
      queryString?: LogTableRow;
    };

    console.log(`${messagePrefix}: current state:`);
    const logTable: LogTable = {
      state: {
        prefix: qPfx,
        board: this.kbModel.keyboardElementName,
        map: this.keymap.uniqueId,
        layer: this.keymap.layers.indexOf(this.layer),
        key: this.selectedKey,
      },
    };
    if (kmui) {
      const kmuiId = kmui.getAttribute("id")
        ? "#" + kmui.getAttribute("id")
        : "";
      logTable.attribute = {
        prefix: kmui.getAttribute("query-prefix") || "",
        board: kmui.getAttribute("keyboard-element") || "",
        map: kmui.getAttribute("keymap-id") || "",
        layer: parseInt(kmui.getAttribute("layer") || "0", 10),
        key: kmui.getAttribute("selected-key") || "",
        info: `KeyMapUI${kmuiId}`,
      };
    }
    if (logQueryString) {
      console.log("current query string:", window.location.search);
      if (qPfx) {
        logTable.queryString = {
          prefix: qPfx,
          board: params.get(`${qPfx}-board`) || "",
          map: params.get(`${qPfx}-map`) || "",
          layer: parseInt(params.get(`${qPfx}-layer`) || "NaN", 10) || NaN,
          key: params.get(`${qPfx}-key`) || "",
        };
      } else {
        logTable.queryString = {
          prefix: "",
          board: "",
          map: "",
          layer: NaN,
          key: "",
        };
      }
    }

    console.table(logTable);
  }

  // #endregion

  // #region Private helpers

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

  /* If there is a non-blank keymap for a keyboard model, return it.
   * Otherwise, return the blank keymap.
   * The keyboard model must exist in kbModels.
   */
  #getNonBlankKeyMapIfPossible(keyboardElementName: string): KeyMap {
    const model = this.kbModels.find(
      (m) => m.keyboardElementName === keyboardElementName
    );
    if (!model) {
      throw new Error(`Unknown keyboard element name: ${keyboardElementName}`);
    }
    const boardMaps = this.keymaps.get(model.keyboardElementName)!;
    const nonBlankKeyMap = Array.from(boardMaps.values()).find(
      (km) => km !== model.blankKeyMap
    );
    return nonBlankKeyMap || model.blankKeyMap;
  }

  // #endregion
}
