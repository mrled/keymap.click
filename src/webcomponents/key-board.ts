/* A class representing any keyboard.
 *
 * Specific boards should extend this class.
 */

export abstract class KeyBoard extends HTMLElement {
  constructor() {
    super();
  }

  /* Subclasses should implement this method to create child elements.
   */
  createChildren({ keymapName }: { keymapName: string }) {}
}
