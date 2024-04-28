---
layout: site.njk
demo: true
eleventyNavigation:
  title: ErgoDox demo
  parent: demos
---

This is a demo of `@keymap.click/ui` showing an ErgoDox keyboard with my layout.

Toggle debug controls on all KeymapUI elements on this page:
<button onclick="toggleAllKeymapUiDebug()">Toggle Debug Controls</button>

<div id="app"></div>

<script type="module">
  import "@keymap.click/ui";
  import "@keymap.click/keyboard.ergodox";
  import { MicahErgodoxLayout } from "@keymap.click/layout.mrlergo";
  const app = document.getElementById("app");
  const keymapUi = document.createElement("keymap-ui");
  const availableKeymaps = [MicahErgodoxLayout];
  keymapUi.setAttribute("id", "keymap-title");
  keymapUi.setAttribute("show-debug", "true");
  keymapUi.setAttribute("query-prefix", "keymap");
  keymapUi.setModelsAndMaps(availableKeymaps);
  app.appendChild(keymapUi);
</script>
