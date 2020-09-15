import React, { useCallback, useContext, useState, useEffect } from "react";

import log from "loglevel";

import { Diagram } from "~/components/diagram";
import { InfoPanel } from "~/components/keyInfo";

import { DocumentDimensionsContext } from "~/components/appContext";
import { Keyboard } from "~/components/keyboard";
import { VisualDebugStyle } from "~/components/visualDebugStyle";
import { FakeDOMRect } from "~/lib/geometry";
import { useAppSettings } from "~/hooks/useAppSettings";
import { useKeyConnections } from "~/hooks/useKeyConnections";
import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";
import { useWindowSize } from "~/hooks/useWindowSize";

export const KeymapUI = () => {
  const { debugLevel } = useAppSettings();
  const [, updateDocumentDimensions] = useContext(DocumentDimensionsContext);
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

  const [keyboardAndPanelRect, setKeyboardAndPanelRect] = useState(
    new FakeDOMRect()
  );
  const keyboardAndPanel = useCallback(
    (node) => {
      if (node !== null) setKeyboardAndPanelRect(node.getBoundingClientRect());
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.keyId, // If this changes, the size of the keyInfo panel may change
      windowSize, // If this changes, windows change size horizontally and we may encounter size breakpoints
    ]
  );

  const [diamargLeftRect, setDiamargLeftRect] = useState(new FakeDOMRect());
  const diamargLeft = useCallback(
    (node) => {
      if (node !== null) setDiamargLeftRect(node.getBoundingClientRect());
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      keyboardAndPanelRect, // If this changes, the diamargs should both change
    ]
  );

  const [diamargRightRect, setDiamargRightRect] = useState(new FakeDOMRect());
  const diamargRight = useCallback(
    (node) => {
      if (node !== null) setDiamargRightRect(node.getBoundingClientRect());
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      keyboardAndPanelRect, // If this changes, the diamargs should both change
    ]
  );

  const [keyInfoContainerRect, setKeyInfoContainerRect] = useState(
    new FakeDOMRect()
  );
  const keyInfoContainer = useCallback(
    (node) => {
      if (node != null) setKeyInfoContainerRect(node.getBoundingClientRect());
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [windowSize]
  );

  useEffect(() => {
    log.debug(
      `Document dimensions should update due to a dependency change...`
    );
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
  ]);

  useEffect(() => {
    log.debug(
      [
        `Rectangles:`,
        `diamargLeftRect: ${JSON.stringify(diamargLeftRect)}`,
        `diamargRightRec: ${JSON.stringify(diamargRightRect)}`,
        `keyboardAndPanelRect: ${JSON.stringify(keyboardAndPanelRect)}`,
        `keyInfoContainerRect: ${JSON.stringify(keyInfoContainerRect)}`,
      ].join("\n")
    );
  }, [
    diamargLeftRect,
    diamargRightRect,
    keyInfoContainerRect,
    keyboardAndPanelRect,
  ]);

  const { connections, targetKeyIds } = useKeyConnections(
    state.keyId,
    keyboardAndPanelRect.top
  );

  return (
    <>
      <VisualDebugStyle enableDebug={debugLevel > 1} />

      <div
        className="w-full h-full text-sm md:text-base p-4 max-w-screen-lg mx-auto"
        id="keymap-ui-outer-wrapper-container"
      >
        <div
          className="w-full md:mr-8 md:px-4"
          id="keymap-ui-content-container"
        >
          {/* Some notes on naming:
              KID is Keyboard, InfoPanel, Diamargs.
              - The Keyboard is a <Keyboard> component.
              - The InfoPanel is our <InfoPanel> component.
              - Diamargs are diagram margins -- ¡¡Not CSS margins!!, but margins like a book has.
                They are narrow divs on either side of the Keyboard/InfoPanel reserved for diagram lines.
              The diagram lines are drawn from the Keyboard, to the InfoPanel, via the Diamargs.
          */}
          <div className="flex" id="keymap-ui-kid-container">
            <div
              className="flex flex-col kid-diamarg m-0 p-0 border-0 debug-bg-red"
              id="keymap-ui-diamarg-left"
              ref={diamargLeft}
            />

            <div
              className="flex flex-col kid-center m-0 p-0 border-0"
              id="keymap-ui-keyboard-and-panel-container"
              ref={keyboardAndPanel}
            >
              <Keyboard targetKeyIds={targetKeyIds} />

              <div
                className="bottom-auto top-0 left-0 right-0 border border-gray-300 bg-gray-100 rounded-md p-4 mb-4 mx-auto w-full debug-bg-teal"
                id="keymap-ui-info-panel-container"
                ref={keyInfoContainer}
              >
                <InfoPanel />
              </div>
            </div>

            <div
              className="flex flex-col kid-diamarg m-0 p-0 border-0 debug-bg-red"
              id="keymap-ui-diamarg-right"
              ref={diamargRight}
            />
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
        />
      </div>
    </>
  );
};
