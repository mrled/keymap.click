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

/* Menu toggle for responsive navigation */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector("#sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      const isOpen = sidebar.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking a link
    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});
