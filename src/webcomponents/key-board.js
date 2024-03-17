/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

class KeyBoard extends HTMLElement {
  constructor() {
    super();
  }

  /* Subclasses should implement this method to create child elements.
   */
  createChildren({ keymapName }) {}
}

if (!customElements.get("key-board")) {
  customElements.define("key-board", KeyBoard);
}

export { KeyBoard };
