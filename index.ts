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

const titleBar = document.createElement("div");
titleBar.className = "site-title-bar";

const title = document.createElement("h1");
const titleLink = document.createElement("a");
titleLink.href = "/";
titleLink.textContent = "keymap.click";
title.appendChild(titleLink);

titleBar.appendChild(title);

const aboutLink = document.createElement("a");
aboutLink.href = "/about.html";
aboutLink.textContent = "About";
const aboutListItem = document.createElement("li");
aboutListItem.appendChild(aboutLink);

const debugCheckbox = document.createElement("input");
debugCheckbox.type = "checkbox";
debugCheckbox.id = "debug-checkbox";
debugCheckbox.addEventListener("change", () => {
  const keyMapUi = document.querySelector("key-map-ui");
  if (keyMapUi) {
    keyMapUi.setAttribute("debug", debugCheckbox.checked.toString());
  }
});
const debugLabel = document.createElement("label");
debugLabel.htmlFor = "debug-checkbox";
debugLabel.textContent = "Enable debugging";
const debugListItem = document.createElement("li");
debugListItem.appendChild(debugCheckbox);
debugListItem.appendChild(debugLabel);

const menuList = document.createElement("ul");
menuList.className = "site-menu";
menuList.appendChild(aboutListItem);
menuList.appendChild(debugListItem);
titleBar.appendChild(menuList);

app.appendChild(titleBar);

const keyMapUI = document.createElement("key-map-ui") as KeyMapUI;
keyMapUI.setAttribute("keyboard-element", "key-board-ergodox");
app.appendChild(keyMapUI);
keyMapUI.keyMap = MicahErgodoxLayout;

const footer = document.createElement("p");
footer.className = "site-footer";
footer.textContent = "Thanks for all the clicks";
app.appendChild(footer);
