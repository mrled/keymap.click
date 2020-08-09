import {
  createContext,
} from "react";

export const appDebugDefault = { debugLevel: 1 };
export const documentDimensionsDefault = { width: 0, height: 0 };
export const legendMapDefault = { legendMapName: "MrlLegends" };
export const keyMapDefault = { keyMapName: "MrlMainLayer" };
export const pressedKeyDefault = { pressedKeyData: {} };

export const AppDebugContext = createContext(appDebugDefault);
export const DocumentDimensionsContext = createContext(documentDimensionsDefault);
export const LegendMapContext = createContext(legendMapDefault);
export const KeyMapContext = createContext(keyMapDefault);
export const PressedKeyContext = createContext(pressedKeyDefault);