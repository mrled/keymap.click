/* Import all our code so that esbuild can find it.
 *
 * Only elements that are required by consumers should be exported here.
 * Also, make sure all our custom elements get registered.
 *
 * This can be done with a plugin or something, but we probably don't need to.
 * <https://github.com/evanw/esbuild/issues/722>
 */

import { ClickyUIElement } from "~/webcomponents/clicky-ui";
import { ClickyTitleScreenKeymap } from "~/lib/keymaps/ClickyTitleScreenKeymap";
import { ClickyTitleScreenKeymapManyLayer } from "~/lib/keymaps/ClickyTitleScreenKeymapManyLayer";
import { MicahErgodoxKeymap } from "~/lib/keymaps/MicahErgodoxKeymap";
import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";

registerAllKeymapClickWebComponents();

export {
  ClickyUIElement,
  MicahErgodoxKeymap,
  ClickyTitleScreenKeymapManyLayer,
  ClickyTitleScreenKeymap,
};
