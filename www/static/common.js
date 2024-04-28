/* JS code available on all pages
 */

/* Toggle debug controls for all KeymapUI elements on the page
 */
function toggleAllKeymapUiDebug() {
  document.querySelectorAll("keymap-ui").forEach((keymapUi) => {
    if (keymapUi.getAttribute("show-debug") === "true") {
      keymapUi.setAttribute("show-debug", "false");
    } else {
      keymapUi.setAttribute("show-debug", "true");
    }
  });
}
