import { ClickyKeyboardErgodoxElement } from "~/webcomponents/clicky-keyboard-ergodox";
import { ClickyKeyboardTitleBarElement } from "~/webcomponents/clicky-keyboard-title-bar";
import { ClickyKeyboardTitleScreenElement } from "~/webcomponents/clicky-keyboard-title-screen";
import { ClickyKeygridElement } from "~/webcomponents/clicky-keygrid";
import { ClickyKeyHandleElement } from "~/webcomponents/clicky-key-handle";
import { ClickyIndicatorElement } from "~/webcomponents/clicky-indicator";
import { ClickyNavbarElement } from "~/webcomponents/clicky-navbar";
import { ClickyUIElement } from "~/webcomponents/clicky-ui";
import { ClickyDiagramElement } from "~/webcomponents/clicky-diagram";
import { ClickyKeyElement } from "~/webcomponents/clicky-key";
import { ClickyControlsElement } from "~/webcomponents/clicky-controls";

const allWebComponents = [
  ClickyControlsElement,
  ClickyDiagramElement,
  ClickyKeyElement,
  ClickyKeygridElement,
  ClickyKeyHandleElement,
  ClickyIndicatorElement,
  ClickyKeyboardErgodoxElement,
  ClickyKeyboardTitleBarElement,
  ClickyKeyboardTitleScreenElement,
  ClickyNavbarElement,
  ClickyUIElement,
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
