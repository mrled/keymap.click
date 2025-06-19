---
layout: site.njk
demo: true
eleventyNavigation:
  title: Multi demo
  parent: demos
---

This is a demo of `@keymap.click/ui` with a bunch of different layouts and models to choose from --
more than most normal sites would use.

Toggle debug controls on all KeymapUI elements on this page:
<button onclick="toggleAllKeymapUiDebug()">Toggle Debug Controls</button>

<div id="app"></div>

<script type="module">
  import { KeymapTitleScreenLayoutManyLayer } from "@keymap.click/ui";
  import { Planck48ExampleLayout } from "/keymaps/planck48-example.js";
  import "@keymap.click/keyboard.ergodox";
  import { MicahErgodoxLayout } from "@keymap.click/layout.mrlergo";
  const app = document.getElementById("app");
  const keymapUi = document.createElement("keymap-ui");
  const availableKeymaps = [
    Planck48ExampleLayout,
    Planck48ExampleLayout.model.blankKeymap,
    KeymapTitleScreenLayoutManyLayer,
    KeymapTitleScreenLayoutManyLayer.model.blankKeymap,
    MicahErgodoxLayout,
    MicahErgodoxLayout.model.blankKeymap,
  ];
  keymapUi.setAttribute("id", "keymap-title");
  keymapUi.setAttribute("show-debug", "true");
  keymapUi.setAttribute("query-prefix", "keymap");
  keymapUi.setModelsAndMaps(availableKeymaps);
  keymapUi.setAttribute("keymap-id", "title-screen-map");
  app.appendChild(keymapUi);
</script>
