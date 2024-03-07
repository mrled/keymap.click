import { useRouter } from "next/router";
import React, { useEffect } from "react";

import * as Fathom from "fathom-client";

import "~/styles/vars.css";
import "~/styles/index.css";
import "~/styles/diagram.css";
import "~/styles/fonts.css";
import "~/styles/keygrid.css";

import { AppHead } from "~/components/appHead";
import {
  DocumentDimensionsContext,
  useDocumentDimensions,
} from "~/hooks/useDocumentDimensions";

function App({ Component, pageProps }) {
  const router = useRouter();
  const docDimensions = useDocumentDimensions();

  useEffect(() => {
    Fathom.load("HDMUSVII", {
      includedDomains: [
        "keyblay.now.sh",
        "keymap.click",
        "keymap-dot-click.vercel.app",
      ],
    });
    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router.events]);

  return (
    <>
      <DocumentDimensionsContext.Provider value={docDimensions}>
        <AppHead />
        <Component {...pageProps} />
      </DocumentDimensionsContext.Provider>
    </>
  );
}

export default App;
