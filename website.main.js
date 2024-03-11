import "./website.style.css";
import "./src/webcomponents/keyboard-key";

document.querySelector("#app").innerHTML = `
  <div>
    <h1><a href="/">keymap.click</a></h1>
    <button is="keyboard-key" position="0 0 auto auto" legend-text="esc" standalone id="standalone-esc"></button>
  </div>
`;
