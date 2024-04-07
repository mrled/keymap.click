/* The diagram is the canvas where we draw lines to keys on the keyboard to draw user attention.
 */
import { KeyMapUIState } from "~/lib/KeyMapUIState";
import { IStateObserver } from "~/lib/State";
import { drawDiagram } from "~/lib/diagram";

export class KeyMapUIDiagram
  extends HTMLElement
  implements IStateObserver<KeyMapUIState> {
  //
  centerPanel: HTMLElement | null = null;
  diamargLeft: HTMLElement | null = null;
  diamargRight: HTMLElement | null = null;
  infoProse: HTMLElement | null = null;

  private _state: KeyMapUIState = new KeyMapUIState();
  set state(state: KeyMapUIState) {
    this._state = state;
    this._state.attach(this);
    this.draw();
  }
  get state() {
    return this._state;
  }

  constructor() {
    super();
  }

  update<T extends keyof KeyMapUIState>(
    key: T,
    oldValue: KeyMapUIState[T],
    newValue: KeyMapUIState[T]
  ) {
    switch (key) {
      case "connectionPairs":
      case "debug":
        this.draw();
        break;
    }
  }

  private _canvas: HTMLCanvasElement | null = null;
  get canvas(): HTMLCanvasElement {
    if (!this._canvas) {
      this._canvas = this.querySelector("canvas");
    }
    if (!this._canvas) {
      this._canvas = document.createElement("canvas");
      this._canvas.className = "keyboard-diagram";
      this.appendChild(this._canvas);
    }
    return this._canvas;
  }

  /* Check if we have references to all the elements we need to draw the diagram.
   */
  get readyToDraw(): boolean {
    return (
      !!this.centerPanel &&
      !!this.diamargLeft &&
      !!this.diamargRight &&
      !!this.infoProse
    );
  }

  /* Draw the diagram lines connecting the keys to the info panel
   */
  draw() {
    if (!this.state.initialized || !this.readyToDraw) {
      return;
    }
    const debug = this.state.debug;
    drawDiagram(
      this.canvas,
      this.state.connectionPairs.map((c) => c.connection),
      // We know these are not null because we checked readyToDraw
      this.centerPanel!.getBoundingClientRect(),
      this.diamargLeft!.getBoundingClientRect(),
      this.diamargRight!.getBoundingClientRect(),
      this.infoProse!.getBoundingClientRect(),
      debug > 0
    );
  }

  /* Resize the canvas.
   */
  resize = (width: number, height: number) => {
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
  };
}
