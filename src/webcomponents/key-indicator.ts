import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/keyConnections";

/* KeyIndicator: an element off the keyboard that points to some key on the keyboard via a diagram line.
 */
export class KeyIndicator extends HTMLElement {
  static get observedAttributes() {
    return ["id"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.updateComponent();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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