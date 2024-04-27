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
import { MicahErgodoxLayout } from "~/lib/keymaps/MicahErgodoxKeymap";
import { KeymapTitleScreenLayout } from "~/lib/keymaps/Planck48TitleScreenKeymap";
import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";

import { PhysicalKey } from "~/lib/PhysicalKey";
import { KeymapKeyboardElement } from "~/webcomponents/keymap-keyboard";
import { KeymapKey } from "~/lib/Layout";
import { Point, Size } from "~/lib/Geometry";
import { KeymapKeygridElement } from "~/webcomponents/keymap-keygrid";
import { KeyboardModel } from "~/lib/KeyboardModel";

registerAllKeymapClickWebComponents();

export {
  // Used by consumers
  KeymapUIElement,
  MicahErgodoxLayout,
  KeymapTitleScreenLayout,
  KeymapTitleScreenLayoutManyLayer,
  KeymapTitleScreenLayoutOldVersion,
  // Used by authors of keyboard models and layouts
  PhysicalKey,
  KeymapKeyboardElement,
  KeymapKey,
  Point,
  Size,
  KeymapKeygridElement,
  KeyboardModel,
};
