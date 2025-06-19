import { KeyboardModelTitleScreen } from "./title-screen-keyboard.js";
import { KeymapLayout, KeymapKey, KeymapLayer } from "@keymap.click/ui";

/* A dumb function to generate a layer, for testing a board with lots of layers
 */
function generateLayer(layerIdx) {
  const keyLegends = "KEYMAP.CLICK";
  const shortName = `layer${layerIdx}`;
  return KeymapLayer.fromKeyList({
    displayName: `Title Screen Layer ${layerIdx}`,
    shortName: shortName,
    welcome: [
      "K E Y M A P . C L I C K",
      `Welcome to <code>${shortName}</code>.`,
    ],
    keys: KeyboardModelTitleScreen.physicalKeys.map(
      (key, idx) =>
        new KeymapKey({
          name: keyLegends[idx],
          id: `title-screen-${key.position.x}-${key.position.y}`,
          info: [
            `This is the <kbd>${keyLegends[idx]}</kbd> key on <code>${shortName}</code>.`,
          ],
        }),
    ),
  });
}

/* A board with lots of layers, for testing purposes.
 */
export const KeymapTitleScreenLayoutManyLayer = new KeymapLayout({
  displayName: "Title Screen Map Many Layer",
  uniqueId: "title-screen-map-many-layer",
  model: KeyboardModelTitleScreen,
  // Generate 32 layers, which IIRC is QMK's max
  layers: Array.from({ length: 32 }, (_, i) => i).map(generateLayer),
  guides: [],
});
