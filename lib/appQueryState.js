/* State that we keep in the query string
 */

import log from "loglevel";

class QueryState {
  constructor(key, defaultValue) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  setQuery(router, newValue) {
    log.debug(`QueryState ${this.key} updating to ${newValue}`);
    let newQuery = { ...router.query };
    if (newValue) {
      newQuery[this.key] = newValue;
    } else {
      delete newQuery[this.key];
    }
    log.debug(`newQuery: ${JSON.stringify(newQuery)}`)
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  }

  getValue(router) {
    return router.query[this.key] || this.defaultValue;
  }
}

export const LegendMapState = new QueryState("legendMap", "MrlLegends");
export const KeyMapState = new QueryState("keyMap", "MrlMainLayer");
export const SelectedKeyState = new QueryState("keyId", null);
