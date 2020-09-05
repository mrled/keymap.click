import React from "react";

import log from "loglevel";

import { KeymapUI } from "~/components/keymapUi";
import { SiteChrome } from "~/components/siteChrome";
import {
  KeymapUiStateContext,
  useKeymapUiState,
} from "~/hooks/useKeymapUiState";

export default function Home() {
  const keymapUiState = useKeymapUiState();
  keymapUiState.setStateFromQuery();
  log.debug(`On page load, set keymapUiState.state to ${JSON.stringify(keymapUiState.state)}`)
  return (
    <>
      <KeymapUiStateContext.Provider value={keymapUiState}>
        <SiteChrome>
          <KeymapUI />
        </SiteChrome>
      </KeymapUiStateContext.Provider>
    </>
  );
}
