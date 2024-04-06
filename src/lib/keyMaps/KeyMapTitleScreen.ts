import { KeyboardModelTitleScreen } from "~/webcomponents/key-board-title-screen";
import { KeyMap, KeyMapKey, KeyMapLayer } from "../keyMap";

const keyInfoLayer0 = ["K E Y M A P . C L I C K"];
const keyInfoLayer1 = ["I just picked some random words for this layer."];

export const KeyMapTitleScreen = new KeyMap({
  displayName: "Title Screen Map",
  uniqueId: "title-screen-map",
  model: KeyboardModelTitleScreen,
  layers: [
    KeyMapLayer.fromKeyList({
      displayName: "Title Screen Main Layer",
      welcome: [
        `Hello, and welcome to the key map viewer!`,
        `If you&apos;re seeing this, it means you don&apos;t have a key map selected.`,
      ],
      keys: [
        new KeyMapKey({
          name: "K",
          id: "title-screen-1-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "E",
          id: "title-screen-3-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "Y",
          id: "title-screen-5-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "M",
          id: "title-screen-7-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "A",
          id: "title-screen-9-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "P",
          id: "title-screen-11-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: ".",
          id: "title-screen-13-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "C",
          id: "title-screen-15-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "L",
          id: "title-screen-17-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "I",
          id: "title-screen-19-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "C",
          id: "title-screen-21-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "K",
          id: "title-screen-23-1",
          info: keyInfoLayer0,
        }),
      ],
    }),
    KeyMapLayer.fromKeyList({
      displayName: "Title Screen Second Layer",
      welcome: [
        `This is an example second layer for the same layout`,
        `Notice that it uses the same keys as the first layer, but the keys are have different letters.`,
      ],
      keys: [
        new KeyMapKey({
          name: "S",
          id: "title-screen-1-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "C",
          id: "title-screen-3-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "R",
          id: "title-screen-5-1",
          info: keyInfoLayer0,
        }),
        new KeyMapKey({
          name: "E",
          id: "title-screen-7-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "A",
          id: "title-screen-9-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "M",
          id: "title-screen-11-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          unset: true,
          name: "",
          id: "title-screen-13-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "K",
          id: "title-screen-15-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "N",
          id: "title-screen-17-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "I",
          id: "title-screen-19-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "F",
          id: "title-screen-21-1",
          info: keyInfoLayer1,
        }),
        new KeyMapKey({
          name: "E",
          id: "title-screen-23-1",
          info: keyInfoLayer1,
        }),
      ],
    }),
  ],
  guides: [],
});
