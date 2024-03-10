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

import React, { useEffect, useRef } from "react";
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

/* Wrapper for keyboard-key
 *
 * Has special handling for React-style onClick,
 * because passing HTML-style onclick to a web component requires passing a string to a global function,
 * while I need to pass a function reference from my React code.
 * TODO: how will this work when we have converted the whole app to web components and no longer have React?
 */
export const Key = dynamic(
  () =>
    import("~/webcomponents/keyboard-key").then(() => {
      const Component = ({ onClick, children, ...props }) => {
        const ref = useRef(null);

        useEffect(() => {
          // Keep a reference to the element at the time useEffect was called.
          // Ensures that the reference we're cleaning up in the return function
          // is the same as the reference we're adding the event listener to.
          const current = ref.current;
          if (current && onClick) {
            // Set onClick in a way that allows us to pass a function reference
            current.addEventListener("click", onClick);
            // Return a cleanup function, which will be called when the component is unmounted
            return () => current.removeEventListener("click", onClick);
          }
        }, [onClick]);

        // Pass the React ref to the web component
        return (
          <button ref={ref} is="keyboard-key" {...props}>
            {children}
          </button>
        );
      };
      Component.displayname = "Key";
      return Component;
    }),
  {
    ssr: false,
  }
);
