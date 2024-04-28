import { KeymapKeyboardPlanck48Element } from "./keymap-keyboard-planck48";
import { KeymapKeyboardTitleBarElement } from "~/webcomponents/keymap-keyboard-title-bar";
import { KeymapKeyboardTitleScreenElement } from "~/webcomponents/keymap-keyboard-title-screen";
import { KeymapKeygridElement } from "~/webcomponents/keymap-keygrid";
import { KeymapKeyHandleElement } from "~/webcomponents/keymap-key-handle";
import { KeymapIndicatorElement } from "~/webcomponents/keymap-indicator";
import { KeymapNavbarElement } from "~/webcomponents/keymap-navbar";
import { KeymapUIElement } from "~/webcomponents/keymap-ui";
import { KeymapDiagramElement } from "~/webcomponents/keymap-diagram";
import { KeymapKeyElement } from "~/webcomponents/keymap-key";

const allWebComponents = [
  KeymapDiagramElement,
  KeymapKeyElement,
  KeymapKeygridElement,
  KeymapKeyHandleElement,
  KeymapIndicatorElement,
  KeymapKeyboardPlanck48Element,
  KeymapKeyboardTitleBarElement,
  KeymapKeyboardTitleScreenElement,
  KeymapNavbarElement,
  KeymapUIElement,
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
  for (const webComponent of allWebComponents) {
    if (!customElements.get(webComponent.elementName)) {
      customElements.define(webComponent.elementName, webComponent);
    }
  }
}
