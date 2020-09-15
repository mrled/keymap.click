import { createContext } from "react";

export const documentDimensionsDefault = { width: 0, height: 0 };

export const DocumentDimensionsContext = createContext(
  documentDimensionsDefault
);
