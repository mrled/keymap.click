import { createContext } from "react";

import { useIdempotentLoggedState } from "~/hooks/useLoggedState";
import { sizeObjEq } from "~/lib/geometry";

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
  if (isClient) {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    };
  } else {
    return documentDimensionsDefault;
  }
};

export const useDocumentDimensions = () => {
  const [documentDimensions, setDocumentDimensions] = useIdempotentLoggedState(
    getCurrentDocumentSize(),
    "documentDimensions",
    sizeObjEq
  );

  const updateDocumentDimensions = () => {
    setDocumentDimensions(getCurrentDocumentSize());
  };

  return [documentDimensions, updateDocumentDimensions];
};
