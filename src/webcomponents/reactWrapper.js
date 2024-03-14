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

export const WCKeyHandle = dynamic(
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
export const WCKeyboardKey = dynamic(
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

export const WCKeyIndicator = dynamic(
  () =>
    import("~/webcomponents/key-indicator").then(() => {
      const Component = ({ children, ...props }) => (
        <span is="key-indicator" {...props}>
          {children}
        </span>
      );
      Component.displayName = "KeyIndicator";
      return Component;
    }),
  {
    ssr: false,
  }
);

/* Wrapper for key-grid
 *
 * Has special handling for creating keys from props.
 * This used to be done in the React component's constructor,
 * but the web component's constructor isn't the right place to do it --
 * we want users of the web component to be able to define their child keys as HTML if they wish.
 */
export const WCKeyGrid = dynamic(
  () =>
    import("~/webcomponents/key-grid").then(() => {
      const Component = ({
        keys,
        legends,
        onClickEach,
        pressedKey,
        targetKeyIds,
        keySelection,
        children,
        ...props
      }) => {
        const keyGridRef = useRef(null);

        useEffect(() => {
          if (keyGridRef.current && keys) {
            keyGridRef.current.createKeys({
              keys,
              legends,
              onClickEach,
              pressedKey,
              targetKeyIds,
              keySelection,
            });
          }
        }, [
          keys,
          legends,
          onClickEach,
          pressedKey,
          targetKeyIds,
          keySelection,
        ]);

        return (
          <key-grid ref={keyGridRef} {...props}>
            {children}
          </key-grid>
        );
      };
      Component.displayName = "KeyGrid";
      return Component;
    }),
  {
    ssr: false,
  }
);

/* Wrapper for keyboard-ergodox
 */
export const WCKeyBoardErgodox = dynamic(
  () =>
    import("~/webcomponents/key-board-ergodox").then(() => {
      const component = ({
        keys,
        legends,
        onClickEach,
        pressedKey,
        targetKeyIds,
        keySelection,
        children,
        ...props
      }) => {
        const boardRef = useRef(null);
        useEffect(() => {
          if (boardRef.current && keys && keys.keyMap) {
            boardRef.current.createChildren({
              keys,
              legends,
              onClickEach,
              pressedKey,
              targetKeyIds,
              keySelection,
            });
          }
        }, [
          keys,
          legends,
          onClickEach,
          pressedKey,
          targetKeyIds,
          keySelection,
        ]);
        return (
          <keyboard-ergodox ref={boardRef} {...props}>
            {children}
          </keyboard-ergodox>
        );
      };
      component.displayName = "ErgodoxKeyboard";
      return component;
    }),
  {
    ssr: false,
  }
);
