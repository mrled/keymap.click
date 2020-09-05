import {
  useEffect,
} from "react";

import log from "loglevel";

import { useLocalStorage } from "~/hooks/useLocalStorage";

/* Update application state based on the appDebug.
 * Intended to be called from a useEffect() hook that is called on appDebug value change.
 * Expects the hook to pass the new appDebug value.
 */
const handleAppDebugChange = (debugLevel) => {
  switch (debugLevel) {
    case 0: log.setLevel(log.levels.SILENT); break;
    case 1: log.setLevel(log.levels.DEBUG); break;
    case 2: log.setLevel(log.levels.TRACE); break;
    default: log.setLevel(log.levels.SILENT); break;
  }
  log.debug(`handleAppDebugChange(): Handled new debugLevel value: ${JSON.stringify(debugLevel)}`);
};

export function useAppSettings() {

  const localStorageKeyDebugLevel = "click.keymap.key.debugLevel";
  const localStorageKeyAdvancedMode = "click.keymap.key.advancedMode";

  const [debugLevel, setDebugLevel] = useLocalStorage(localStorageKeyDebugLevel, 0);
  const [advancedMode, setAdvancedMode] = useLocalStorage(localStorageKeyAdvancedMode, false);

  useEffect(() => {
    handleAppDebugChange(debugLevel);
  }, [debugLevel]);

  return {
    debugLevel, setDebugLevel,
    advancedMode, setAdvancedMode,
  }
}
