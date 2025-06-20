import { KeymapKey, KeymapLayer, KeymapLayout } from "~/lib/Layout";
import { KeyboardModelDefault } from "./DefaultKeyboard";

const keyInfoLayer0 = ["K E Y M A P . C L I C K"];

/* A simple title screen layout with two layers, for demos
 */
export const DefaultLayout = new KeymapLayout({
  displayName: "Default Keyboard Layout",
  uniqueId: "default-keyboard",
  model: KeyboardModelDefault,
  layers: [
    KeymapLayer.fromKeyList({
      displayName: "ERROR: No keyboard available",
      shortName: "Default",
      welcome: [
        `If you see this, you need to pass a keyboard model to the keymap-ui element.`,
      ],
      keys: [
        new KeymapKey({
          name: "K",
          id: "default-keyboard-1-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "E",
          id: "default-keyboard-3-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "Y",
          id: "default-keyboard-5-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "M",
          id: "default-keyboard-7-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "A",
          id: "default-keyboard-9-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "P",
          id: "default-keyboard-11-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: ".",
          id: "default-keyboard-13-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "default-keyboard-15-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "L",
          id: "default-keyboard-17-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "I",
          id: "default-keyboard-19-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "default-keyboard-21-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "K",
          id: "default-keyboard-23-1",
          info: keyInfoLayer0,
        }),
      ],
    }),
  ],
  guides: [],
});
