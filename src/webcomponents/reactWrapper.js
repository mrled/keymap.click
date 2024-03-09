/* This is a React / Next wrapper for all my web components.
 *
 * Next expects to be able to render the entire app on the server side,
 * but this is not possible with web components.
 * I am not benefiting from Next's server-side rendering for the keymap anyway,
 * so waiting until the client loads is ok.
 *
 * We use Next dynamic imports to only load the web components on the client side
 * We define a React component for each web component,
 * which can be used elsewhere in the application.
 *
 * WARNING: DO NOT PUT DOM MANIPULATION CODE IN WEB COMPONENT CONSTRUCTORS.
 * If you do, the web component will be created on the server side,
 * the DOM manipulation will fail, and Next will show an error on load.
 * Also, apparently that is not the right place anyway;
 * Instead, put that code in the connectedCallback() method.
 */

import React from "react";
import dynamic from "next/dynamic";

export const KeyHandle = dynamic(
  () =>
    import("~/webcomponents/key-handle").then(() => {
      const Component = ({ children, ...props }) => (
        <key-handle {...props}>{children}</key-handle>
      );
      Component.displayName = "KeyHandle";
      return Component;
    }),
  {
    ssr: false,
  }
);
