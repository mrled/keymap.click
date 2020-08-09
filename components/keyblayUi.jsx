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
  KeyMapContext,
  LegendMapContext,
  PressedKeyContext,
} from "~/components/appContext";
import { Keyboard } from "~/components/keyboard";
import { VisualDebugStyle } from "~/components/visualDebugStyle";
// import {
//   useAppRoute,
// } from "~/lib/appRouter";
import {
  FakeDOMRect,
} from "~/lib/geometry";
import { useWindowSize } from "~/lib/hooks";
import { useKeyConnections } from "~/lib/keyConnections";
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";
import { AppSettings } from "./appSettings";
import { updateRoute } from "~/lib/appRouter";

export const KeyblayUI = () => {
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [appDebug, setAppDebug] = useContext(AppDebugContext)
  const [documentDimensions, updateDocumentDimensions] = useContext(DocumentDimensionsContext)
  const [keyMap, setKeyMap] = useContext(KeyMapContext)
  const [legendMap, setLegendMap] = useContext(LegendMapContext)
  const [pressedKey, setPressedKey] = useContext(PressedKeyContext);
  const windowSize = useWindowSize();
  const router = useRouter();

  // useCallback(() => {
  //   const keyMapObj = keyMaps[keyMap.keyMapName];
  //   const qKeyId = router.query.keyId;
  //   const qLegendMap = router.query.legendMap;
  //   const qKeyMap = router.query.keyMap;

  //   if (qKeyId && keyMapObj.allKeysById[qKeyId]) {
  //     setPressedKey(keyMapObj.allKeysById[qKeyId]);
  //     log.debug(`On load using selected key id: ${qKeyId}`);
  //   } else {
  //     log.debug(`On load no such key id: ${qKeyId}`);
  //   }

  //   if (qLegendMap && legendMaps[qLegendMap]) {
  //     setLegendMap(qLegendMap);
  //     log.debug(`On load using selected legend map: ${qLegendMap}`);
  //   } else {
  //     log.debug(`On load no such legend map: ${qLegendMap}`)
  //   }

  //   if (qKeyMap && keyMaps[qKeyMap]) {
  //     setKeyMap(qKeyMap);
  //     log.debug(`On load using selected key map: ${qKeyMap}`);
  //   } else {
  //     log.debug(`On load no such key map: ${qKeyMap}`)
  //   }
  // }, [router.query, keyMap, setKeyMap, setLegendMap, setPressedKey])

  // useCallback(() => {
  //   useEffect(() => {
  //     const newKeyId = pressedKey ? pressedKey.id : router.query.keyId;
  //     const newKeyMap = keyMap ? keyMap : router.query.keyMap;
  //     const newLegendMap = legendMap ? legendMap : router.query.legendMap;
  //     router.push({
  //       pathName: '/',
  //       query: {
  //         keyId: newKeyId,
  //         keyMap: newKeyMap,
  //         legendMap: newLegendMap,
  //       }
  //     });
  //   });
  // }, [keyMap, legendMap, pressedKey, router])


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

              <h1 className="text-2xl flex-col p-2">Layout Guide</h1>

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
                targetKeyIds={targetKeyIds}
                keyMapName={keyMap.keyMapName}
              />

              <div
                className="bottom-auto top-0 left-0 right-0 border border-gray-300 bg-gray-100 rounded-md p-4 mb-4 mx-auto w-full debug-bg-teal"
                id="keyblay-ui-info-panel-container"
              >
                <InfoPanel
                  keyData={pressedKey}
                  keyButtonOnClick={() => {
                    router.push("/");
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
