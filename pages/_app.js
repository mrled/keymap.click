import "../styles/index.css";
import "../styles/keygrid.css";
import "../styles/fonts.css";
import "../styles/debug.css";
import * as Fathom from 'fathom-client'

function App({ Component, pageProps }) {

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
