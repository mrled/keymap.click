import { useRouter } from 'next/router'
import React, {
  useEffect,
  useState,
} from 'react'

import * as Fathom from 'fathom-client'
import log from "loglevel";

import "~/styles/index.css";
import "~/styles/keygrid.css";
import "~/styles/fonts.css";

import {
  AppDebugContext,
  DocumentDimensionsContext,
  KeyMapContext,
  LegendMapContext,
  PressedKeyContext,
  appDebugDefault,
  documentDimensionsDefault,
  keyMapDefault,
  legendMapDefault,
  pressedKeyDefault,
} from "~/components/appContext";
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";

/* Update application state based on the appDebug.
 * Intended to be called from a useEffect() hook that is called on appDebug value change.
 * Expects the hook to pass the new appDebug value.
 */
export const handleAppDebugChange = (appDebug) => {
  switch (appDebug.debugLevel) {
    case 0: log.setLevel(log.levels.SILENT); break;
    case 1: log.setLevel(log.levels.DEBUG); break;
    case 2: log.setLevel(log.levels.TRACE); break;
    default: log.setLevel(log.levels.SILENT); break;
  }
  log.debug(`Handled new appDebug value: ${JSON.stringify(appDebug)}`);
};

function App({ Component, pageProps }) {

  const [appDebug, setAppDebug] = useState(appDebugDefault);
  const [keyMap, setKeyMap] = useState(keyMapDefault);
  const [legendMap, setLegendMap] = useState(legendMapDefault);
  const [pressedKey, setPressedKey] = useState(pressedKeyDefault);
  const router = useRouter();


  const keyMapObj = keyMaps[keyMap.keyMapName];
  const qKeyId = router.query.keyId;
  const qLegendMap = router.query.legendMap;
  const qKeyMap = router.query.keyMap;

  if (qKeyId && qKeyId !== "undefined" && keyMapObj.allKeysById[qKeyId]) {
    if (pressedKey != qKeyId) {
      setPressedKey(keyMapObj.allKeysById[qKeyId]);
      log.debug(`On load using selected key id: ${qKeyId}`);
    } else {
      log.debug(`On load router key ID ${qKeyId} matched current pressed key ${pressedKey}`);
    }

  } else {
    log.debug(`On load no such key id: ${qKeyId}`);
  }

  if (qLegendMap && qLegendMap != "undefined" && legendMaps[qLegendMap]) {
    setLegendMap(qLegendMap);
    log.debug(`On load using selected legend map: ${qLegendMap}`);
  } else {
    log.debug(`On load no such legend map: ${qLegendMap}`)
  }

  if (qKeyMap && qKeyMap != "undefined" && keyMaps[qKeyMap]) {
    setKeyMap(qKeyMap);
    log.debug(`On load using selected key map: ${qKeyMap}`);
  } else {
    log.debug(`On load no such key map: ${qKeyMap}`)
  }



  /* Manage document size context
   * It would be really nice if the document object fired an event when it changed size that we could listen to,
   * but it doesn't.
   * Instead, we use a Context and we allow context consumers to request an update at any time.
   * We don't allow consumers to set an arbitrary value, only to request that the context value be updated
   * to the result of getCurrentDocumentSize() here.
   * Note that we are therefore intentionally not using a memoized callback for updateDocumentDimensions.
   */

  const getCurrentDocumentSize = () => {
    const isClient = typeof document === "object";
    return {
      width: isClient ? document.documentElement.scrollWidth : undefined,
      height: isClient ? document.documentElement.scrollHeight : undefined,
    };
  };

  const [documentDimensions, setDocumentDimensions] = useState(getCurrentDocumentSize());

  const updateDocumentDimensions = () => {
    const newDocumentDimensions = getCurrentDocumentSize();
    log.debug(`Updating document dimensions\nOld: ${JSON.stringify(documentDimensions)}\nNew: ${JSON.stringify(newDocumentDimensions)}`);
    setDocumentDimensions(getCurrentDocumentSize());
  }


  useEffect(() => {
    Fathom.load('HDMUSVII', {
      includedDomains: ['keyblay.now.sh']
    });
    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    }
  }, [router.events]);

  useEffect(() => {
    handleAppDebugChange(appDebug);
  }, [appDebug]);

  return <>
    <AppDebugContext.Provider value={[appDebug, setAppDebug]}>
      <DocumentDimensionsContext.Provider value={[documentDimensions, updateDocumentDimensions]}>
        <KeyMapContext.Provider value={[keyMap, setKeyMap]}>
          <LegendMapContext.Provider value={[legendMap, setLegendMap]}>
            <PressedKeyContext.Provider value={[pressedKey, setPressedKey]}>
              <Component {...pageProps} />
            </PressedKeyContext.Provider>
          </LegendMapContext.Provider>
        </KeyMapContext.Provider>
      </DocumentDimensionsContext.Provider>
    </AppDebugContext.Provider>
  </>
}

export default App;
