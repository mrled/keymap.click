import "../styles/index.css";
import "../styles/keygrid.css";
import "../styles/fonts.css";
import "../styles/debug.css";

import {
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

import { AppDebugContext } from "~/components/appDebugContext";

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
  }, [])

  return <>
    <AppDebugContext.Provider value={[appDebug, setAppDebug]}>
      <Component {...pageProps} />;
    </AppDebugContext.Provider>
  </>
}

export default App;
