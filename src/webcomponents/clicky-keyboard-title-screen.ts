import { PhysicalKey } from "~/lib/PhysicalKey";
import { ClickyKeyboardElement } from "~/webcomponents/clicky-keyboard";
import { KeymapKey } from "~/lib/Keymap";
import { Point, Size } from "~/lib/Geometry";
import { ClickyKeygridElement } from "~/webcomponents/clicky-keygrid";
import { KeyboardModel } from "~/lib/KeyboardModel";

export const KeyboardModelTitleScreen = new KeyboardModel(
  "clicky-keyboard-title-screen",
  "Clicky Title Screen Keyboard",
  new Point(2, 2),
  new Size(2, 2),
  [
    new PhysicalKey("title-screen", new Point(1, 1), new Size(2, 2)), // K
    new PhysicalKey("title-screen", new Point(3, 1), new Size(2, 2)), // E
    new PhysicalKey("title-screen", new Point(5, 1), new Size(2, 2)), // Y
    new PhysicalKey("title-screen", new Point(7, 1), new Size(2, 2)), // M
    new PhysicalKey("title-screen", new Point(9, 1), new Size(2, 2)), // A
    new PhysicalKey("title-screen", new Point(11, 1), new Size(2, 2)), // P
    new PhysicalKey("title-screen", new Point(13, 1), new Size(2, 2)), // .
    new PhysicalKey("title-screen", new Point(15, 1), new Size(2, 2)), // C
    new PhysicalKey("title-screen", new Point(17, 1), new Size(2, 2)), // L
    new PhysicalKey("title-screen", new Point(19, 1), new Size(2, 2)), // I
    new PhysicalKey("title-screen", new Point(21, 1), new Size(2, 2)), // C
    new PhysicalKey("title-screen", new Point(23, 1), new Size(2, 2)), // K
  ]
);

/* An ErgoDox keyboard.
 */
export class ClickyKeyboardTitleScreenElement extends ClickyKeyboardElement {
  static readonly elementName = "clicky-keyboard-title-screen";
  readonly elementName = ClickyKeyboardTitleScreenElement.elementName;

  constructor() {
    super();
  }

  readonly model = KeyboardModelTitleScreen;

  /* Create keygrid and key elements from key data for this board.
   */
  createChildren(keys: KeymapKey[]) {
    this.removeAllChildren();

    const title = document.createElement("h2");
    title.textContent = "Title Board";
    this.appendChild(title);

    const gridContainer = document.createElement("div");
    gridContainer.className = "keygrid-container";
    this.appendChild(gridContainer);

    const keygrid = document.createElement(
      ClickyKeygridElement.elementName
    ) as ClickyKeygridElement;
    keygrid.setAttribute("name", "title-screen");
    keygrid.setAttribute("cols", "24");
    keygrid.setAttribute("rows", "2");
    keygrid.createKeys(this, keys);
    gridContainer.appendChild(keygrid);
  }
}
