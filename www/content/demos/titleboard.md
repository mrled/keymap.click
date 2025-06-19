---
layout: site.njk
demo: true
eleventyNavigation:
  title: Titleboard demo
  parent: demos
---

This is a demo of `@keymap.click/ui` with the example title screen keyboard model.

Toggle debug controls on all KeymapUI elements on this page:
<button onclick="toggleAllKeymapUiDebug()">Toggle Debug Controls</button>

<div id="app"></div>

<script type="module">
  import { KeymapTitleScreenLayout } from "@keymap.click/ui";
  const app = document.getElementById("app");
  const keymapUi = document.createElement("keymap-ui");
  const availableKeymaps = [KeymapTitleScreenLayout];
  keymapUi.setAttribute("id", "keymap-title");
  keymapUi.setAttribute("show-debug", "true");
  keymapUi.setAttribute("query-prefix", "keymap");
  keymapUi.setModelsAndMaps(availableKeymaps);
  app.appendChild(keymapUi);
</script>
