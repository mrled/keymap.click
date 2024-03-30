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

const clearQueryStringButton = document.createElement("button");
clearQueryStringButton.textContent = "Clear query string";
clearQueryStringButton.addEventListener("click", () => {
  window.history.pushState({}, document.title, window.location.pathname);
  window.location.reload();
});
const clearQueryStringListItem = document.createElement("li");
clearQueryStringListItem.appendChild(clearQueryStringButton);

const testLink = document.createElement("a");
testLink.href = "http://localhost:5173/?kmui-key=l-f-10-9&kmui-map=blank";
testLink.textContent = "Hit test URL";
const testListItem = document.createElement("li");
testListItem.appendChild(testLink);

const menuList = document.createElement("ul");
menuList.className = "site-menu";
menuList.appendChild(aboutListItem);
menuList.appendChild(debugListItem);
menuList.appendChild(clearQueryStringListItem);
menuList.appendChild(testListItem);
titleBar.appendChild(menuList);

app.appendChild(titleBar);

const keyMapUI = document.createElement("key-map-ui") as KeyMapUI;
keyMapUI.setAttribute("keyboard-element", "key-board-ergodox");
keyMapUI.availableKeyMaps = [MicahErgodoxLayout];
keyMapUI.setAttribute("keymap-id", "micah-ergodox");
keyMapUI.setAttribute("query-prefix", "kmui");
app.appendChild(keyMapUI);

const footer = document.createElement("p");
footer.className = "site-footer";
footer.textContent = "Thanks for all the clicks";
app.appendChild(footer);
