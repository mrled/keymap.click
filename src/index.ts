/* Import all our code so that esbuild can find it.
 *
 * TODO: consider writing a script or using a plugin that does this.
 * <https://github.com/evanw/esbuild/issues/722>
 */

// import "~/lib/diagram.ts";
// import "~/lib/geometry.ts";
// import "~/lib/KeyboardModel.ts";
// import "~/lib/keyConnections.ts";
// import "~/lib/keyMap.ts";
// import "~/lib/KeyMapUIOptions.ts";
// import "~/lib/KeyMapUIState.ts";
// import "~/lib/physicalKey.ts";
// import "~/lib/QueryStringState.ts";
// import "~/lib/State.ts";

// import "~/lib/keyMaps/KeyMapTitleScreen.ts";
// import "~/lib/keyMaps/micahErgodox.ts";

// import "~/webcomponents/key-board.ts";
// import "~/webcomponents/key-board-ergodox.ts";
// import "~/webcomponents/key-board-title-bar.ts";
// import "~/webcomponents/key-board-title-screen.ts";
// import "~/webcomponents/key-grid.ts";
// import "~/webcomponents/key-handle.ts";
// import "~/webcomponents/key-indicator.ts";
// import "~/webcomponents/key-info-nav-bar.ts";
// import "~/webcomponents/key-map-ui.ts";
// import "~/webcomponents/key-map-ui-controls.ts";
// import "~/webcomponents/key-map-ui-diagram.ts";
// import "~/webcomponents/keyboard-key.ts";
// import "~/webcomponents/registerall.ts";

import { KeyMapUI } from "~/webcomponents/key-map-ui";
import { KeyMapTitleScreen } from "~/lib/keyMaps/KeyMapTitleScreen";
import { MicahErgodoxLayout } from "~/lib/keyMaps/micahErgodox";
import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";

registerAllKeymapClickWebComponents();

export { KeyMapUI, MicahErgodoxLayout, KeyMapTitleScreen };
