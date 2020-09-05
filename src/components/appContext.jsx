import {
  createContext,
} from "react";

export const appDebugDefault = { debugLevel: 0 };
export const visibleMenuDefault = false;

export const AppDebugContext = createContext(appDebugDefault);
export const VisibleMenuContext = createContext(visibleMenuDefault);
