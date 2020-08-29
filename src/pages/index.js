import React from "react";

import log from "loglevel";

import { KeymapUI } from "~/components/keymapUi";
import { MenuBar } from "~/components/menuBar";
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
        <MenuBar />
        <KeymapUI />
      </KeymapUiStateContext.Provider>
    </>
  );
}
