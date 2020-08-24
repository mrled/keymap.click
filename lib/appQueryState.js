/* State that we keep in the query string
 */

import log from "loglevel";

class QueryState {
  constructor(key, defaultValue) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  /* Set the query string with a new value - DEPRECATED
   *
   * New code should call the exported setQueryState() function
   */
  setQuery(router, newValue) {
    setQueryState(router, [this, newValue])
  }

  getValue(router) {
    return router.query[this.key] || this.defaultValue;
  }
}

/* Set the query state for one or more settings
 *
 * Allows changing multiple settings at once.
 *
 * This functionality used to be on the QueryState class,
 * but changing two settings at once was not possible.
 */
export const setQueryState = (router, ...settingValuePairList) => {
  let newQuery = { ...router.query };
  settingValuePairList.forEach((settingValuePair) => {
    let [setting, newValue] = settingValuePair;
    if (newValue && newValue != setting.defaultValue) {
      newQuery[setting.key] = newValue;
    } else {
      delete newQuery[setting.key];
    }
  });
  log.debug(`newQuery: ${JSON.stringify(newQuery)}`)
  router.push({
    pathname: router.pathname,
    query: newQuery,
  });
}

export const LegendMapState = new QueryState("legendMap", "MrlLegends");
export const KeyMapState = new QueryState("keyMap", "MrlMainLayer");
export const SelectedKeyState = new QueryState("keyId", null);
