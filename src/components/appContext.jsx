import {
  createContext,
} from "react";

export const documentDimensionsDefault = { width: 0, height: 0 };
export const visibleMenuDefault = false;

export const DocumentDimensionsContext = createContext(documentDimensionsDefault);
export const VisibleMenuContext = createContext(visibleMenuDefault);
