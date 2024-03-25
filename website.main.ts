/* The Vite entrypoint for the website
 */

// Styles specific to the website - not part of the webcomponents
import "./website.style.css";

// Ordered styles
import "./src/styles/vars.css";
import "./src/styles/index.css";
// Alphabetical styles
import "./src/styles/controls.css";
import "./src/styles/debug.css";
import "./src/styles/diagram.css";
import "./src/styles/fonts.css";
import "./src/styles/keygrid.css";
import "./src/styles/keyInfoPanel.css";
import "./src/styles/siteChrome.css";

import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";
registerAllKeymapClickWebComponents();

import { keyMaps } from "./src/lib/keys";
import { KeyMapUI } from "~/webcomponents/key-map-ui";
import { MicahErgodoxLayout } from "~/lib/keyMaps/micahErgodox";

/* Navigate to page-specific URLs
 *
 * Possible URL patterns:
 * /keymap-name/key:key-id
 * /keymap-name/guide:guide-step
 *
 * The keymap will indicate which board type its for.
 */
function navigate({
  keyMapName,
  guideStep,
  keyId,
}: {
  keyMapName: string;
  guideStep: string;
  keyId: string;
}) {
  console.log("navigate()", keyId);
  const keyMap = keyMaps[keyMapName];
  const key = keyMap[keyId];
  const urlAnchor = `/${keyMapName}/key:${keyId}`;
  const urlBase = window.location.href.split("#")[0];
  const newUrl = `${urlBase}#${urlAnchor}`;
  window.history.pushState({}, newUrl, newUrl);
}

const app = document.querySelector("#app");
if (!app) {
  throw new Error("No app element found");
}

const title = document.createElement("h1");
const titleLink = document.createElement("a");
titleLink.href = "/";
titleLink.textContent = "keymap.click";
title.appendChild(titleLink);
app.appendChild(title);

const keyMapUI = document.createElement("key-map-ui") as KeyMapUI;
keyMapUI.setAttribute("keyboard-element", "key-board-ergodox");
app.appendChild(keyMapUI);
keyMapUI.keyMap = MicahErgodoxLayout;

const footer = document.createElement("p");
footer.textContent = "Thanks for all the clicks";
app.appendChild(footer);
