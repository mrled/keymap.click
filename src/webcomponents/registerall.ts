import { KeyBoardErgodox } from "~/webcomponents/key-board-ergodox";
import { KeyBoardTitleBar } from "~/webcomponents/key-board-title-bar";
// import { KeyBoard } from "~/webcomponents/key-board";
import { KeyGrid } from "~/webcomponents/key-grid";
import { KeyHandle } from "~/webcomponents/key-handle";
import { KeyIndicator } from "~/webcomponents/key-indicator";
import { KeyInfoNavBar } from "~/webcomponents/key-info-nav-bar";
import { KeyMapUI } from "~/webcomponents/key-map-ui";
import { KeyboardKey } from "~/webcomponents/keyboard-key";

interface Registration {
  elementName: string;
  elementClass: any;
  defineOptions?: ElementDefinitionOptions;
}

const registrations: Registration[] = [
  { elementName: "key-handle", elementClass: KeyHandle },
  { elementName: "key-indicator", elementClass: KeyIndicator },
  {
    elementName: "keyboard-key",
    elementClass: KeyboardKey,
  },
  { elementName: "key-grid", elementClass: KeyGrid },
  // { elementName: "key-board", elementClass: KeyBoard }, // Can't define abstract classes
  { elementName: "key-board-ergodox", elementClass: KeyBoardErgodox },
  { elementName: "key-board-title-bar", elementClass: KeyBoardTitleBar },
  { elementName: "key-info-nav-bar", elementClass: KeyInfoNavBar },
  { elementName: "key-map-ui", elementClass: KeyMapUI },
];

/* Register all keymap.click web components
 *
 * This should be called before using any of the web components we define.
 * There seems to be no way to assure that all web components are registered automatically,
 * so we have to do it explicitly here.
 * (We can't use module loading side effects because TypeScript will not run them!
 * <https://github.com/microsoft/TypeScript/issues/9191>)
 */
export function registerAllKeymapClickWebComponents() {
  // Register all web components
  for (const { elementName, elementClass, defineOptions } of registrations) {
    if (!customElements.get(elementName)) {
      customElements.define(elementName, elementClass, defineOptions);
    }
  }
}
