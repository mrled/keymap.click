/* Import all our code so that esbuild can find it.
 *
 * TODO: consider writing a script or using a plugin that does this.
 * <https://github.com/evanw/esbuild/issues/722>
 */

import { ClickyUIElement } from "~/webcomponents/clicky-ui";
import { ClickyTitleScreenKeymap } from "~/lib/keymaps/ClickyTitleScreenKeymap";
import { MicahErgodoxKeymap } from "~/lib/keymaps/MicahErgodoxKeymap";
import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";

registerAllKeymapClickWebComponents();

export { ClickyUIElement, MicahErgodoxKeymap, ClickyTitleScreenKeymap };
