import React, { useContext } from "react";

import { Diagram } from "~/components/diagram";
import { InfoPanel } from "~/components/keyInfo";

import { Keyboard } from "~/components/keyboard";
import { useAppSettings } from "~/hooks/useAppSettings";
import { useBoundingClientRect } from "~/hooks/useBoundingClientRect";
import { useIsomorphicLayoutEffect } from "~/hooks/useIsomorphicLayoutEffect";
import { useKeyConnections } from "~/hooks/useKeyConnections";
import { DocumentDimensionsContext } from "~/hooks/useDocumentDimensions";
import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";
import { useWhyDidYouUpdate } from "~/hooks/useWhyDidYouUpdate";
import { useWindowSize } from "~/hooks/useWindowSize";

export const KeymapUI = () => {
  useWhyDidYouUpdate("KeymapUI", {});

  const { debugLevel } = useAppSettings();
  const [documentDimensions, updateDocumentDimensions] = useContext(
    DocumentDimensionsContext
  );
  const windowSize = useWindowSize();
  const { state } = useContext(KeymapUiStateContext);

  /* Calculating rects of child elements
   * See also https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
   * Note that we are dependent on the dimensions of both the viewport (window) AND the whole document.
   * The diamargs also have to depend on the keyboard/panel height.
   * keyboard/panel height depends on the InfoPanel because of the length of the text.
   * Note that we have to ignore react-hooks/exhaustive-deps,
   * because the dependencies we list are not explicitly used in the hook.
   */
  const [keyboardAndPanel, keyboardAndPanelRect] = useBoundingClientRect(
    [
      state.keyId, // If this changes, the size of the keyInfo panel may change
      windowSize, // If this changes, windows change size horizontally and we may encounter size breakpoints
    ],
    "keyboardAndPanel"
  );
  const [diamargLeft, diamargLeftRect] = useBoundingClientRect(
    [
      keyboardAndPanelRect, // If this changes, the diamargs should both change
    ],
    "diamargLeft"
  );
  const [diamargRight, diamargRightRect] = useBoundingClientRect(
    [
      keyboardAndPanelRect, // If this changes, the diamargs should both change
    ],
    "diamargRight"
  );
  const [keyInfoContainer, keyInfoContainerRect] = useBoundingClientRect(
    [windowSize],
    "keyInfoContainer"
  );

  useIsomorphicLayoutEffect(() => {
    updateDocumentDimensions();
    // We must NOT pass updateDocumentDimensions as a dependency for this effect, or it will cause an infinite loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    keyboardAndPanelRect,
    state.keyId,

    // I would expect keyboardAndPanelRect to imply diamargLeft/RightRect and keyInfoContainerRect,
    // but I am getting strange renders sometimes, where visual debugging shows that the diagram
    // does not have correct coordinates for anything, including the these values.
    // Maybe I need to pass them explicitly?
    diamargLeftRect,
    diamargRightRect,
    keyInfoContainerRect,
    windowSize,
  ]);

  const { connections, targetKeyIds } = useKeyConnections(
    state.keyId,
    keyboardAndPanelRect ? keyboardAndPanelRect.top : 0,
    documentDimensions,
    keyInfoContainerRect,
    diamargLeftRect,
    diamargRightRect
  );

  return (
    <>
      <div>
        {/* Some notes on naming:
              KID is Keyboard, InfoPanel, Diamargs.
              - The Keyboard is a <Keyboard> component.
              - The InfoPanel is our <InfoPanel> component.
              - Diamargs are diagram margins -- ¡¡Not CSS margins!!, but margins like a book has.
                They are narrow divs on either side of the Keyboard/InfoPanel reserved for diagram lines.
              The diagram lines are drawn from the Keyboard, to the InfoPanel, via the Diamargs.
          */}
        <div className="keymap-ui-kid-container">
          <div className="keymap-ui-diamarg debug-bg-red" ref={diamargLeft} />

          <div className="keymap-ui-center-panel" ref={keyboardAndPanel}>
            <Keyboard targetKeyIds={targetKeyIds} />

            <div
              className="keymap-ui-keyinfo-container debug-bg-teal"
              ref={keyInfoContainer}
            >
              <InfoPanel />
            </div>
          </div>

          <div className="keymap-ui-diamarg debug-bg-red" ref={diamargRight} />
        </div>
      </div>

      {/* We place the canvas last and therefore we do not need to specify a z-index -
       * it is naturally on top of the other content.
       */}
      <Diagram
        connections={connections}
        keyboardAndPanelRect={keyboardAndPanelRect}
        diamargLeftRect={diamargLeftRect}
        diamargRightRect={diamargRightRect}
        keyInfoContainerRect={keyInfoContainerRect}
        documentDimensions={documentDimensions}
        windowSize={windowSize}
      />
    </>
  );
};
