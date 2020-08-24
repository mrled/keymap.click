import {
  createContext,
} from "react";

export const appDebugDefault = { debugLevel: 0 };
export const documentDimensionsDefault = { width: 0, height: 0 };
export const visibleMenuDefault = false;

export const AppDebugContext = createContext(appDebugDefault);
export const DocumentDimensionsContext = createContext(documentDimensionsDefault);
export const VisibleMenuContext = createContext(visibleMenuDefault);
