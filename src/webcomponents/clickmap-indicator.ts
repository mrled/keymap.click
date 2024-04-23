import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/DiagramConnections";

/* ClickmapIndicatorElement: an element off the keyboard that points to some key on the keyboard via a diagram line.
 */
export class ClickmapIndicatorElement extends HTMLElement {
  static readonly elementName = "clickmap-indicator";

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
