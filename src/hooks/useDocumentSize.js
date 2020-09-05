import {
  createContext,
  useState,
} from "react";

import log from "loglevel";


/* Manage document size context
 * It would be really nice if the document object fired an event when it changed size that we could listen to,
 * but it doesn't.
 * Instead, we use a Context and we allow context consumers to request an update at any time.
 * We don't allow consumers to set an arbitrary value, only to request that the context value be updated
 * to the result of getCurrentDocumentSize() here.
 * Note that we are therefore intentionally not using a memoized callback for updateDocumentSize.
 */
const documentSizeDefault = { width: 0, height: 0 };
export const DocumentSizeContext = createContext(documentSizeDefault);
export const useDocumentSize = () => {

  const getCurrentDocumentSize = () => {
    const isClient = typeof document === "object";
    return {
      width: isClient ? document.documentElement.scrollWidth : undefined,
      height: isClient ? document.documentElement.scrollHeight : undefined,
    };
  };

  const [documentSize, setDocumentSize] = useState(getCurrentDocumentSize());

  const updateDocumentSize = () => {
    const newDocumentSize = getCurrentDocumentSize();
    log.debug(`Updating document Size\nOld: ${JSON.stringify(documentSize)}\nNew: ${JSON.stringify(newDocumentSize)}`);
    setDocumentSize(getCurrentDocumentSize());
  }

  return [documentSize, updateDocumentSize];
}