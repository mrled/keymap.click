import "../styles/index.css";
import "../styles/keygrid.css";
import "../styles/fonts.css";
import "../styles/debug.css";

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

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

  return <Component {...pageProps} />;
}

export default App;
