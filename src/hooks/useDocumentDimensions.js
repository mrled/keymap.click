import { createContext, useState } from "react";

import log from "loglevel";

/* Manage document size context
 * It would be really nice if the document object fired an event when it changed size that we could listen to,
 * but it doesn't.
 * Instead, we use a Context and we allow context consumers to request an update at any time.
 * We don't allow consumers to set an arbitrary value, only to request that the context value be updated
 * to the result of getCurrentDocumentSize() here.
 * Note that we are therefore intentionally not using a memoized callback for updateDocumentDimensions.
 */

const documentDimensionsDefault = { width: 0, height: 0 };

export const DocumentDimensionsContext = createContext(
  documentDimensionsDefault
);

const getCurrentDocumentSize = () => {
  const isClient = typeof document === "object";
  return {
    width: isClient ? document.documentElement.scrollWidth : undefined,
    height: isClient ? document.documentElement.scrollHeight : undefined,
  };
};

export const useDocumentDimensions = () => {
  const [documentDimensions, setDocumentDimensions] = useState(
    getCurrentDocumentSize()
  );

  const updateDocumentDimensions = () => {
    const newDocumentDimensions = getCurrentDocumentSize();
    log.debug(
      `Updating document dimensions\nOld: ${JSON.stringify(
        documentDimensions
      )}\nNew: ${JSON.stringify(newDocumentDimensions)}`
    );
    setDocumentDimensions(getCurrentDocumentSize());
  };

  return [documentDimensions, updateDocumentDimensions];
};
