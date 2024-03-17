import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/keyConnections";

/* KeyIndicator: an element off the keyboard that points to some key on the keyboard via a diagram line.
 */
class KeyIndicator extends HTMLElement {
  static get observedAttributes() {
    return ["id"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.updateComponent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateComponent();
  }

  updateComponent() {
    const keyId = this.getAttribute("id");
    if (keyId) {
      const connectToId = `${keyInfoConnectFromClassPrefix}${keyId}`;
      this.classList.add(keyInfoConnectFromClass);
      this.classList.add(connectToId);
    }
  }
}

if (!customElements.get("key-indicator")) {
  customElements.define("key-indicator", KeyIndicator);
}

export { KeyIndicator };
