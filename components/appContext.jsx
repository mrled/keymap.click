import {
  createContext,
} from "react";

export const AppDebugContext = createContext({ debugLevel: 0 });
export const LegendMapContext = createContext({ legendMapName: "MrlLegends" });
export const KeyMapContext = createContext({ keyMapName: "MrlMainLayer" });
