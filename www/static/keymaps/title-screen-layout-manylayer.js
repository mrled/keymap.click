import { KeyboardModelTitleScreen } from "./title-screen-keyboard.js";
import {
  KeymapGuide,
  KeymapLayout,
  KeymapKey,
  KeymapLayer,
} from "@keymapkit/ui";

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

const allKeySelection = [
  "title-screen-1-1",
  "title-screen-3-1",
  "title-screen-5-1",
  "title-screen-7-1",
  "title-screen-9-1",
  "title-screen-11-1",
  "title-screen-13-1",
  "title-screen-15-1",
  "title-screen-17-1",
  "title-screen-19-1",
  "title-screen-21-1",
  "title-screen-23-1",
];

/* A board with lots of layers, for testing purposes.
 */
export const KeymapTitleScreenLayoutManyLayer = new KeymapLayout({
  displayName: "Title Screen Map Many Layer",
  uniqueId: "title-screen-map-many-layer",
  model: KeyboardModelTitleScreen,
  // Generate 32 layers, which IIRC is QMK's max
  layers: Array.from({ length: 32 }, (_, i) => i).map(generateLayer),
  guides: [
    new KeymapGuide({
      title: "First Guide",
      shortName: "Guide1",
      id: "guide1",
      steps: [
        {
          title: "Welcome to the guide to my main keyboard layout",
          text: [
            `
              This is the title board.
              All the keys are highlighted in orange.
            `,
          ],
          selection: allKeySelection,
        },
        {
          title: "First key",
          text: [
            `
            Now just one key is highlighted.
            `,
          ],
          selection: "title-screen-1-1",
        },
        {
          title: "The end",
          text: [`Thanks for all the clicks.`],
        },
      ],
    }),
    new KeymapGuide({
      title: "Second Guide",
      shortName: "Guide2",
      id: "guide2",
      steps: [
        {
          title: "This is just a copy of the first guide",
          text: [
            `
            We use this copy for testing purposes.
            Here again all the keys are highlighted in orange.
            `,
          ],
          selection: allKeySelection,
        },
        {
          title: "First key",
          text: [
            `
            Now just one key is highlighted.
            `,
          ],
          selection: "title-screen-1-1",
        },
        {
          title: "The end",
          text: [`Thanks for all the clicks.`],
        },
      ],
    }),
  ],
});
