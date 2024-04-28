/* Import all our code so that esbuild can find it.
 *
 * Only elements that are required by consumers should be exported here.
 * Also, make sure all our custom elements get registered.
 *
 * This can be done with a plugin or something, but we probably don't need to.
 * <https://github.com/evanw/esbuild/issues/722>
 */

import { KeymapUIElement } from "~/webcomponents/keymap-ui";
import { KeymapTitleScreenLayoutOldVersion } from "~/lib/keymaps/KeymapTitleScreenLayoutOldVersion";
import { KeymapTitleScreenLayoutManyLayer } from "~/lib/keymaps/KeymapTitleScreenLayoutManyLayer";
import { KeymapTitleScreenLayout } from "~/lib/keymaps/Planck48TitleScreenKeymap";
import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";

import { PhysicalKey } from "~/lib/PhysicalKey";
import { KeymapLayout, KeymapGuide, KeymapLayer } from "~/lib/Layout";
import { KeymapKeyboardElement } from "~/webcomponents/keymap-keyboard";
import { KeymapKey } from "~/lib/Layout";
import { Point, Size } from "~/lib/Geometry";
import { KeymapKeygridElement } from "~/webcomponents/keymap-keygrid";
import { KeyboardModel } from "~/lib/KeyboardModel";

registerAllKeymapClickWebComponents();

export {
  // Used by consumers
  KeymapUIElement,
  KeymapTitleScreenLayout,
  KeymapTitleScreenLayoutManyLayer,
  KeymapTitleScreenLayoutOldVersion,
  // Used by authors of keyboard models and layouts
  PhysicalKey,
  KeymapKeyboardElement,
  KeymapLayout,
  KeymapGuide,
  KeymapLayer,
  KeymapKey,
  Point,
  Size,
  KeymapKeygridElement,
  KeyboardModel,
};
