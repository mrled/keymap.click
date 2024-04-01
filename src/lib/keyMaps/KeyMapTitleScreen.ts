import { KeyboardModelTitleScreen } from "~/webcomponents/key-board-title-screen";
import { KeyMap, KeyMapKey } from "../keyMap";

const keyInfo = ["K E Y M A P . C L I C K"];

export const KeyMapTitleScreen = new KeyMap({
  displayName: "Title Screen Map",
  uniqueId: "title-screen-map",
  model: KeyboardModelTitleScreen,
  welcome: [
    `Hello, and welcome to the key map viewer!`,
    `If you&apos;re seeing this, it means you don&apos;t have a key map selected.`,
  ],
  keys: [
    new KeyMapKey({
      name: "K",
      id: "title-screen-1-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "E",
      id: "title-screen-3-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "Y",
      id: "title-screen-5-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "M",
      id: "title-screen-7-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "A",
      id: "title-screen-9-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "P",
      id: "title-screen-11-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: ".",
      id: "title-screen-13-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "C",
      id: "title-screen-15-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "L",
      id: "title-screen-17-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "I",
      id: "title-screen-19-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "C",
      id: "title-screen-21-1",
      info: keyInfo,
    }),
    new KeyMapKey({
      name: "K",
      id: "title-screen-23-1",
      info: keyInfo,
    }),
  ],
  guides: [],
});
