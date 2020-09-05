import React from "react";

import log from "loglevel";

import { KeymapUI } from "~/components/keymapUi";
import { MenuBar } from "~/components/menuBar";
import {
  DocumentSizeContext,
  useDocumentSize,
} from "~/hooks/useDocumentSize";
import {
  KeymapUiStateContext,
  useKeymapUiState,
} from "~/hooks/useKeymapUiState";

export default function Home() {
  const [documentSize, updateDocumentSize] = useDocumentSize();
  const keymapUiState = useKeymapUiState();
  keymapUiState.setStateFromQuery();
  log.debug(`On page load, set keymapUiState.state to ${JSON.stringify(keymapUiState.state)}`)
  return (
    <>
      <DocumentSizeContext.Provider value={[documentSize, updateDocumentSize]}>
        <KeymapUiStateContext.Provider value={keymapUiState}>
          <MenuBar />
          <KeymapUI />
        </KeymapUiStateContext.Provider>
      </DocumentSizeContext.Provider>
    </>
  );
}
