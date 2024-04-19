import { KeyboardModelTitleScreen } from "~/webcomponents/clicky-keyboard-title-screen";
import { Keymap, KeymapKey, KeymapLayer } from "../Keymap";

const keyInfoLayer0 = ["K E Y M A P . C L I C K"];
const keyInfoLayer1 = ["I just picked some random words for this layer."];

export const ClickyTitleScreenKeymap = new Keymap({
  displayName: "Title Screen Map",
  uniqueId: "title-screen-map",
  model: KeyboardModelTitleScreen,
  layers: [
    KeymapLayer.fromKeyList({
      displayName: "Title Screen Main Layer",
      welcome: [
        `Hello, and welcome to the key map viewer!`,
        `If you&apos;re seeing this, it means you don&apos;t have a key map selected.`,
      ],
      keys: [
        new KeymapKey({
          name: "K",
          id: "title-screen-1-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "E",
          id: "title-screen-3-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "Y",
          id: "title-screen-5-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "M",
          id: "title-screen-7-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "A",
          id: "title-screen-9-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "P",
          id: "title-screen-11-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: ".",
          id: "title-screen-13-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "title-screen-15-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "L",
          id: "title-screen-17-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "I",
          id: "title-screen-19-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "title-screen-21-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "K",
          id: "title-screen-23-1",
          info: keyInfoLayer0,
        }),
      ],
    }),
    KeymapLayer.fromKeyList({
      displayName: "Title Screen Second Layer",
      welcome: [
        `This is an example second layer for the same layout`,
        `Notice that it uses the same keys as the first layer, but the keys are have different letters.`,
      ],
      keys: [
        new KeymapKey({
          name: "S",
          id: "title-screen-1-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "C",
          id: "title-screen-3-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "R",
          id: "title-screen-5-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "E",
          id: "title-screen-7-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "A",
          id: "title-screen-9-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "M",
          id: "title-screen-11-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          unset: true,
          name: "",
          id: "title-screen-13-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "K",
          id: "title-screen-15-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "N",
          id: "title-screen-17-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "I",
          id: "title-screen-19-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "F",
          id: "title-screen-21-1",
          info: keyInfoLayer1,
        }),
        new KeymapKey({
          name: "E",
          id: "title-screen-23-1",
          info: keyInfoLayer1,
        }),
      ],
    }),
  ],
  guides: [],
});
