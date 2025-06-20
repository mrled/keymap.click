/* JS code available on all pages
 */

/* Toggle debugging for all KeymapUI elements on the page
 */
function toggleAllKeymapUiDebug() {
  document.querySelectorAll("keymap-ui").forEach((keymapUi) => {
    const currentVal = parseInt(keymapUi.getAttribute("debug"), 10);
    if (currentVal > 0) {
      keymapUi.setAttribute("debug", "0");
    } else {
      keymapUi.setAttribute("debug", "1");
    }
  });
}
