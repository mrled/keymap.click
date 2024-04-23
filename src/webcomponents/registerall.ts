import { ClickmapKeyboardErgodoxElement } from "~/webcomponents/clickmap-keyboard-ergodox";
import { ClickmapKeyboardTitleBarElement } from "~/webcomponents/clickmap-keyboard-title-bar";
import { ClickmapKeyboardTitleScreenElement } from "~/webcomponents/clickmap-keyboard-title-screen";
import { ClickmapKeygridElement } from "~/webcomponents/clickmap-keygrid";
import { ClickmapKeyHandleElement } from "~/webcomponents/clickmap-key-handle";
import { ClickmapIndicatorElement } from "~/webcomponents/clickmap-indicator";
import { ClickmapNavbarElement } from "~/webcomponents/clickmap-navbar";
import { ClickmapUIElement } from "~/webcomponents/clickmap-ui";
import { ClickmapDiagramElement } from "~/webcomponents/clickmap-diagram";
import { ClickmapKeyElement } from "~/webcomponents/clickmap-key";

const allWebComponents = [
  ClickmapDiagramElement,
  ClickmapKeyElement,
  ClickmapKeygridElement,
  ClickmapKeyHandleElement,
  ClickmapIndicatorElement,
  ClickmapKeyboardErgodoxElement,
  ClickmapKeyboardTitleBarElement,
  ClickmapKeyboardTitleScreenElement,
  ClickmapNavbarElement,
  ClickmapUIElement,
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
