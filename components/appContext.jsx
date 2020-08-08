import {
  createContext,
} from "react";

export const AppDebugContext = createContext({ debugLevel: 0 });
export const DocumentDimensionsContext = createContext({ width: 0, height: 0 });
export const LegendMapContext = createContext({ legendMapName: "MrlLegends" });
export const KeyMapContext = createContext({ keyMapName: "MrlMainLayer" });
