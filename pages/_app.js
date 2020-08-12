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
  appDebugDefault,
} from "~/components/appContext";

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
  const router = useRouter();


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
      includedDomains: [
        'keyblay.now.sh',
        'keymap.click',
        'keymap-dot-click.vercel.app',
      ]
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
        <Component {...pageProps} />
      </DocumentDimensionsContext.Provider>
    </AppDebugContext.Provider>
  </>
}

export default App;
