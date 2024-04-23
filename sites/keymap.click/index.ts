// JS for the index

import "./website.shared.js";

import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";
registerAllKeymapClickWebComponents();

import { ClickmapUIElement } from "~/webcomponents/clickmap-ui.js";
import { ClickmapTitleScreenKeymap } from "~/lib/keymaps/ClickmapTitleScreenKeymap.js";
import { MicahErgodoxKeymap } from "~/lib/keymaps/MicahErgodoxKeymap.js";

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

const clearQueryStringButton = document.createElement("button");
clearQueryStringButton.textContent = "Clear query string";
clearQueryStringButton.addEventListener("click", () => {
  window.history.pushState({}, document.title, window.location.pathname);
  window.location.reload();
});
const clearQueryStringListItem = document.createElement("li");
clearQueryStringListItem.appendChild(clearQueryStringButton);

const testLink = document.createElement("a");
testLink.href = "/?clickmap-key=l-f-10-9&clickmap-map=blank";
testLink.textContent = "Hit test URL";
const testListItem = document.createElement("li");
testListItem.appendChild(testLink);

const menuList = document.createElement("ul");
menuList.className = "site-menu";
menuList.appendChild(aboutListItem);
menuList.appendChild(clearQueryStringListItem);
menuList.appendChild(testListItem);
titleBar.appendChild(menuList);

app.appendChild(titleBar);

const titleDesc = document.createElement("p");
titleDesc.textContent =
  "Here's the title screen. It's useful at least for testing.";
app.appendChild(titleDesc);

const clickmapUiTitle = document.createElement(
  ClickmapUIElement.elementName
) as ClickmapUIElement;
clickmapUiTitle.setAttribute("id", "clickmap-title");
clickmapUiTitle.setAttribute("show-debug", "true");
clickmapUiTitle.setModelsAndMaps([ClickmapTitleScreenKeymap]);
clickmapUiTitle.setAttribute("keymap-id", "title-screen-map");
app.appendChild(clickmapUiTitle);

const ergodoxDesc = document.createElement("p");
ergodoxDesc.textContent =
  "Here's the ErgoDox layout I use. This keymap syncs its state with the query string - try clicking around and then reloading the page or opening in another tab.";
app.appendChild(ergodoxDesc);

const clickmapUiErgodox = document.createElement(
  ClickmapUIElement.elementName
) as ClickmapUIElement;
clickmapUiErgodox.setAttribute("id", "clickmap-ergodox");
clickmapUiErgodox.setAttribute("show-debug", "true");
clickmapUiErgodox.setModelsAndMaps([MicahErgodoxKeymap]);
clickmapUiErgodox.setAttribute("keymap-id", "micah-ergodox");
clickmapUiErgodox.setAttribute("query-prefix", "clickmap");
app.appendChild(clickmapUiErgodox);

const footer = document.createElement("p");
footer.className = "site-footer";
footer.textContent = "Thanks for all the clicks";
app.appendChild(footer);
