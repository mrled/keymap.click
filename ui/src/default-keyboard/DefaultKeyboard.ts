import { Point, Size } from "~/lib/Geometry";
import { KeyboardModel } from "~/lib/KeyboardModel";
import { KeymapKey } from "~/lib/Layout";
import { PhysicalKey } from "~/lib/PhysicalKey";
import { KeymapKeyboardElement } from "~/webcomponents/keymap-keyboard";
import { KeymapKeygridElement } from "~/webcomponents/keymap-keygrid";

/* The title screen keyboard model
 */
const KeyboardModelDefault = new KeyboardModel(
  "default-keyboard",
  "keymap.click Title Screen Keyboard",
  new Point(2, 2),
  new Size(2, 2),
  [
    new PhysicalKey("default-keyboard", new Point(1, 1), new Size(2, 2)), // K
    new PhysicalKey("default-keyboard", new Point(3, 1), new Size(2, 2)), // E
    new PhysicalKey("default-keyboard", new Point(5, 1), new Size(2, 2)), // Y
    new PhysicalKey("default-keyboard", new Point(7, 1), new Size(2, 2)), // M
    new PhysicalKey("default-keyboard", new Point(9, 1), new Size(2, 2)), // A
    new PhysicalKey("default-keyboard", new Point(11, 1), new Size(2, 2)), // P
    new PhysicalKey("default-keyboard", new Point(13, 1), new Size(2, 2)), // .
    new PhysicalKey("default-keyboard", new Point(15, 1), new Size(2, 2)), // C
    new PhysicalKey("default-keyboard", new Point(17, 1), new Size(2, 2)), // L
    new PhysicalKey("default-keyboard", new Point(19, 1), new Size(2, 2)), // I
    new PhysicalKey("default-keyboard", new Point(21, 1), new Size(2, 2)), // C
    new PhysicalKey("default-keyboard", new Point(23, 1), new Size(2, 2)), // K
  ],
);

/* The title screen keyboard element
 */
class DefaultKeyboardElement extends KeymapKeyboardElement {
  static elementName = "default-keyboard";
  elementName = DefaultKeyboardElement.elementName;

  constructor() {
    super();
  }

  model = KeyboardModelDefault;

  /* Create keygrid and key elements from key data for this board.
   */
  createChildren(keys: KeymapKey[]) {
    this.removeAllChildren();

    const gridContainer = document.createElement("div");
    gridContainer.className = "keygrid-container";
    this.appendChild(gridContainer);

    const keygrid = document.createElement(
      KeymapKeygridElement.elementName,
    ) as KeymapKeygridElement;
    keygrid.setAttribute("name", "default-keyboard");
    keygrid.setAttribute("cols", "24");
    keygrid.setAttribute("rows", "2");
    keygrid.createKeys(this, keys);
    gridContainer.appendChild(keygrid);
  }
}

if (!customElements.get(DefaultKeyboardElement.elementName)) {
  customElements.define(
    DefaultKeyboardElement.elementName,
    DefaultKeyboardElement,
  );
}

export { DefaultKeyboardElement, KeyboardModelDefault };
