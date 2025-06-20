import { KeymapLayout, KeymapKey, KeymapLayer } from "@keymap.click/ui";
import { KeyboardModelPlanck48 } from "@keymap.click/keyboard.planck48";

const keyInfoLayer0 = ["K E Y M A P . C L I C K"];

export const Planck48ExampleLayout = new KeymapLayout({
  displayName: "Planck 48 Example",
  uniqueId: "planck48-example-layout",
  model: KeyboardModelPlanck48,
  layers: [
    KeymapLayer.fromKeyList({
      displayName: "Planck 48 Main Layer",
      shortName: "Main",
      welcome: [
        `Hello, and welcome to the key map viewer!`,
        `If you&apos;re seeing this, it means you don&apos;t have a key map selected.`,
      ],
      keys: [
        new KeymapKey({
          name: "K",
          id: "planck-1-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "E",
          id: "planck-3-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "Y",
          id: "planck-5-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "M",
          id: "planck-7-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "A",
          id: "planck-9-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "P",
          id: "planck-11-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: ".",
          id: "planck-13-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "planck-15-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "L",
          id: "planck-17-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "I",
          id: "planck-19-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "C",
          id: "planck-21-1",
          info: keyInfoLayer0,
        }),
        new KeymapKey({
          name: "K",
          id: "planck-23-1",
          info: keyInfoLayer0,
        }),
      ],
    }),
  ],
  guides: [],
});
