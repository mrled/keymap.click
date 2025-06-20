import { KeymapKey, KeymapLayer, KeymapLayout } from "~/lib/Layout";
import { KeyboardModelFallback } from "./FallbackKeyboard";

const keyInfoLayer0 = ["K E Y M A P . C L I C K"];

/* A simple title screen layout with two layers, for demos
 */
export const FallbackLayout = new KeymapLayout({
  displayName: "Default Keyboard Layout",
  uniqueId: "fallback-keyboard",
  model: KeyboardModelFallback,
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
          id: "fallback-keyboard-1-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "E",
          id: "fallback-keyboard-3-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "Y",
          id: "fallback-keyboard-5-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "M",
          id: "fallback-keyboard-7-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "A",
          id: "fallback-keyboard-9-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "P",
          id: "fallback-keyboard-11-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: ".",
          id: "fallback-keyboard-13-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "fallback-keyboard-15-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "L",
          id: "fallback-keyboard-17-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "I",
          id: "fallback-keyboard-19-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "fallback-keyboard-21-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "K",
          id: "fallback-keyboard-23-1",
          info: keyInfoLayer0,
        }),
      ],
    }),
  ],
  guides: [],
});
