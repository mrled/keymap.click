// JS for the index

import "./website.shared.js";

import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";
registerAllKeymapClickWebComponents();

import { KeyMapUI } from "~/webcomponents/key-map-ui";
import { MicahErgodoxLayout } from "~/lib/keyMaps/micahErgodox";

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

const aboutLink = document.createElement("a");
aboutLink.href = "/about.html";
aboutLink.textContent = "About";
app.appendChild(aboutLink);

const keyMapUI = document.createElement("key-map-ui") as KeyMapUI;
keyMapUI.setAttribute("keyboard-element", "key-board-ergodox");
app.appendChild(keyMapUI);
keyMapUI.keyMap = MicahErgodoxLayout;

const footer = document.createElement("p");
footer.textContent = "Thanks for all the clicks";
app.appendChild(footer);
