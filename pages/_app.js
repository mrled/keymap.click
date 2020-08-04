import "../styles/index.css";
import "../styles/keygrid.css";
import "../styles/fonts.css";
import "../styles/debug.css";

import {
  createContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

// import {
//   AppDebugContext,
//   AppDebugProvider,
// } from "~/components/appDebugContext";

export const AppDebugContext = createContext({ debugLevel: 0 });

function App({ Component, pageProps }) {

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

  const [appDebug, setAppDebug] = useState({ debugLevel: 0 });

  return <>
    <AppDebugContext.Provider value={[appDebug, setAppDebug]}>
      <Component {...pageProps} />;
    </AppDebugContext.Provider>
  </>
}

export default App;
