// JS for the index

import "./website.shared.js";

import { registerAllKeymapClickWebComponents } from "~/webcomponents/registerall";
registerAllKeymapClickWebComponents();

import { ClickmapUIElement } from "~/webcomponents/clickmap-ui.js";
import { MicahErgodoxKeymap } from "~/lib/keymaps/MicahErgodoxKeymap.js";
import { ClickmapTitleScreenKeymap } from "~/lib/keymaps/Planck48TitleScreenKeymap.js";

const app = document.querySelector("#app");
if (!app) {
  throw new Error("No app element found");
}

const titleBar = document.createElement("div");
titleBar.className = "site-title-bar";

const title = document.createElement("h1");
const titleLink = document.createElement("a");
titleLink.href = "/";
titleLink.textContent = "Clickmap";
title.appendChild(titleLink);

titleBar.appendChild(title);

app.appendChild(titleBar);

[
  "Clickmap is a tool for visualizing keymaps.",
  "It's designed to help you share your keymaps with others on your own website. You can use it to show off your custom keymap, or to help others understand how to use a new keymap. I built it because when I bought my ErgoDox-EZ to help with my RSI, I wanted to build what I wish had existed for me when I was on the fence about making the investment -- a detailed description not just that the keyboard was ergonomic, but what type of pain it specifically helped with and why.",
  `If you also want to talk about specific key placement or provide details about your layout on your own website, Clickmap is for you. You can provide a detailed explanation of each key, group keys together to describe them in a group (e.g. all QWERTY keys), and users can click around on the board to explore. You can write a guided tour of your map, similar to <a href="https://blog.zsa.io/2004-layout-tours/">tours in Oryx</a>, without needing approval from anyone. In your key explanations or guide steps, you can use Clickmap "key indicator" HTML elements to point to specific keys in the layout, <a href="/?clickmap-map=micah-ergodox&clickmap-key=l-f-8-9">like this</a>.`,
  `To use it, install with npm as <code>npm install @mrled/clickmap</code>, define a layout in JavaScript, instantiate the web component on your page, and pass it your defined layout. If Clickmap doesn't come with a built-in model for your keyboard, you can define your own model. Clickmap currently ships models of ErgoDox and Planck boards. If you want to see a model for a different board, please <a href="https://github.com/mrled/keymap.click/issues">open an issue</a>, or implement it yourself and publish it as a separate package on NPM (and let me know so I can link to it here).`,
  "See the demo below for an example of what Clickmap looks like on a page.",
].forEach((paragraphText) => {
  const paragraph = document.createElement("p");
  paragraph.innerHTML = paragraphText;
  app.appendChild(paragraph);
});

app.appendChild(document.createElement("hr"));

const clickmapUiTitle = document.createElement(
  ClickmapUIElement.elementName
) as ClickmapUIElement;
clickmapUiTitle.setAttribute("id", "clickmap-title");
clickmapUiTitle.setModelsAndMaps([
  ClickmapTitleScreenKeymap,
  MicahErgodoxKeymap,
]);
clickmapUiTitle.setAttribute("keymap-id", "title-screen-map");
clickmapUiTitle.setAttribute("query-prefix", "clickmap");
app.appendChild(clickmapUiTitle);

app.appendChild(document.createElement("hr"));

[
  "For more information, see the <a href='/about.html'>about page</a>.",
  "Thanks for all the clicks.",
].forEach((paragraphText) => {
  const paragraph = document.createElement("p");
  paragraph.innerHTML = paragraphText;
  app.appendChild(paragraph);
});
