/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

class KeyBoard extends HTMLElement {
  constructor() {
    super();
  }
}

if (!customElements.get("key-board")) {
  customElements.define("key-board", KeyBoard);
}

export { KeyBoard };
