import { useRouter } from "next/router";
import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

import log from "loglevel";

import { Diagram } from "~/components/diagram";
import { InfoPanel } from "~/components/infoPanel";

import {
  AppDebugContext,
  DocumentDimensionsContext,
} from "~/components/appContext";
import { Keyboard } from "~/components/keyboard";
import { VisualDebugStyle } from "~/components/visualDebugStyle";
import {
  SelectedKeyState,
} from "~/lib/appQueryState";
import {
  FakeDOMRect,
} from "~/lib/geometry";
import { useWindowSize } from "~/lib/hooks";
import { useKeyConnections } from "~/lib/keyConnections";
import { AppSettings } from "./appSettings";

export const KeyblayUI = () => {
  const [pressedKey, setPressedKey] = useState({});
  const [otherSelectedKeys, setOtherSelectedKeys] = useState([]);
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [appDebug, setAppDebug] = useContext(AppDebugContext)
  const [documentDimensions, updateDocumentDimensions] = useContext(DocumentDimensionsContext)
  const windowSize = useWindowSize();
  const router = useRouter();


  /* Calculating rects of child elements
   * See also https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
   * Note that we are dependent on the dimensions of both the viewport (window) AND the whole document.
   * The diamargs also have to depend on the keyboard/panel height.
   * keyboard/panel height depends on the InfoPanel because of the length of the text.
   */

  const [keyboardAndPanelRect, setKeyboardAndPanelRect] = useState(new FakeDOMRect());
  const keyboardAndPanel = useCallback(node => {
    if (node !== null) setKeyboardAndPanelRect(node.getBoundingClientRect());
  }, [pressedKey, visibleSettings, windowSize]);

  const [diamargLeftRect, setDiamargLeftRect] = useState(new FakeDOMRect());
  const diamargLeft = useCallback(node => {
    if (node !== null) setDiamargLeftRect(node.getBoundingClientRect());
  }, [keyboardAndPanelRect, pressedKey, visibleSettings, windowSize]);

  const [diamargRightRect, setDiamargRightRect] = useState(new FakeDOMRect());
  const diamargRight = useCallback(node => {
    if (node !== null) setDiamargRightRect(node.getBoundingClientRect());
  }, [keyboardAndPanelRect, pressedKey, visibleSettings, windowSize]);

  useEffect(() => {
    log.debug(`Document dimensions should update due to a dependency change...`)
    updateDocumentDimensions();
    // We must NOT pass updateDocumentDimensions as a dependency for this effect, or it will cause an infinite loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardAndPanelRect, pressedKey, visibleSettings]);


  const { connections, targetKeyIds } = useKeyConnections(pressedKey, keyboardAndPanelRect.top);

  return (
    <>

      <VisualDebugStyle enableDebug={appDebug.debugLevel > 1} />

      <div
        className="w-full h-full text-sm md:text-base p-4 flex max-w-screen-lg"
        id="keyblay-ui-outer-wrapper-container"
      >

        <div
          className="w-full md:mr-8 md:px-4 z-10"
          id="keyblay-ui-content-container"
        >

          <div
            className="border border-gray-300 bg-gray-100 rounded-md p-2 m-2"
            id="keyblay-ui-app-bar-container"
          >

            <div className="flex flex-row justify-between">

              <h1 className="text-xl flex-col p-2">keyblay</h1>

              <button
                className="inline text-blue-500 p-2"
                onClick={() => { setVisibleSettings(s => !s) }}>
                {visibleSettings ? "Hide settings" : "Show settings"}
              </button>

            </div>

            <div className="flex flex-row">
              <AppSettings visible={visibleSettings} />
            </div>

          </div>

          {/* Some notes on naming:
            * KID is Keyboard, InfoPanel, Diamargs.
            *   - The Keyboard is a <Keyboard> component.
            *   - The InfoPanel is our <InfoPanel> component.
            *   - Diamargs are diagram margins -- ¡¡Not CSS margins!!, but margins like a book has.
            *     They are narrow divs on either side of the Keyboard/InfoPanel reserved for diagram lines.
            * The diagram lines are drawn from the Keyboard, to the InfoPanel, via the Diamargs.
            */}
          <div
            className="flex"
            id="keyblay-ui-kid-container"
          >

            <div
              className="flex flex-col kid-diamarg m-0 p-0 border-0 debug-bg-red"
              id="keyblay-ui-diamarg-left"
              ref={diamargLeft}
            />

            <div
              className="flex flex-col kid-center m-0 p-0 border-0"
              id="keyblay-ui-keyboard-and-panel-container"
              ref={keyboardAndPanel}
            >

              <Keyboard
                otherSelectedKeys={otherSelectedKeys}
                pressedKey={pressedKey}
                targetKeyIds={targetKeyIds}
                setOtherSelectedKeys={setOtherSelectedKeys}
                setPressedKey={setPressedKey}
              />

              <div
                className="bottom-auto top-0 left-0 right-0 border border-gray-300 bg-gray-100 rounded-md p-4 mb-4 mx-auto w-full debug-bg-teal"
                id="keyblay-ui-info-panel-container"
              >
                <InfoPanel
                  keyData={pressedKey}
                  keyButtonOnClick={() => {
                    SelectedKeyState.setQuery(router, null)
                    setOtherSelectedKeys([]);
                    setPressedKey({});
                  }}
                />
              </div>

            </div>

            <div
              className="flex flex-col kid-diamarg m-0 p-0 border-0 debug-bg-red"
              id="keyblay-ui-diamarg-right"
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
        />

      </div>
    </>
  );
};
