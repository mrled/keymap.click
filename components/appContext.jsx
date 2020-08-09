import {
  createContext,
} from "react";

export const appDebugDefault = { debugLevel: 0 };
export const documentDimensionsDefault = { width: 0, height: 0 };
export const legendMapDefault = { legendMapName: "MrlLegends" };
export const keyMapDefault = { keyMapName: "MrlMainLayer" };

export const AppDebugContext = createContext(appDebugDefault);
export const DocumentDimensionsContext = createContext(documentDimensionsDefault);
export const LegendMapContext = createContext(legendMapDefault);
export const KeyMapContext = createContext(keyMapDefault);
