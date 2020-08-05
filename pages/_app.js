import "../styles/index.css";
import "../styles/keygrid.css";
import "../styles/fonts.css";

import {
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

import log from "loglevel";

import { AppDebugContext } from "~/components/appDebugContext";

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

  const [appDebug, setAppDebug] = useState({ debugLevel: 0 });
  const router = useRouter()

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
  }, []);

  useEffect(() => {
    handleAppDebugChange(appDebug);
  }, [appDebug]);

  return <>
    <AppDebugContext.Provider value={[appDebug, setAppDebug]}>
      <Component {...pageProps} />;
    </AppDebugContext.Provider>
  </>
}

export default App;
