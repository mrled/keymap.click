/* Synchronize the query string and a state object
 */

import { KeyMapUI } from "~/webcomponents/key-map-ui";
import { KeyMapUIState } from "./KeyMapUIState";

/* Read the query string and update the state of the KeyMapUI.
 */
export function setStateFromQueryString(state: KeyMapUIState) {
  const queryPrefix = state.queryPrefix;

  if (!queryPrefix) {
    return;
  }
  const currentParams = new URLSearchParams(window.location.search);

  const qBoard = currentParams.get(`${queryPrefix}-board`);
  const qMap = currentParams.get(`${queryPrefix}-map`);
  const qLayer = currentParams.get(`${queryPrefix}-layer`);
  const qKey = currentParams.get(`${queryPrefix}-key`);

  if (qBoard) state.keyboardElementName = qBoard;
  if (qMap) state.keymapId = qMap;
  if (qLayer) state.layer = parseInt(qLayer, 10);
  if (qKey) state.selectedKey = qKey;
}

/* Set the query string based on the current state.
 *
 * This is called whenever one of the queryable attributes changes.
 * It does not affect any query parameters other than those with the query prefix.
 *
 * If any of the query parameters match the attributes on the element in the DOM,
 * they are removed from the query string.
 * This means the query string overrides the attributes on the element,
 * and the URL isn't cluttered with unnecessary query parameters.
 *
 * This function doesn't handle changes to the query prefix itself;
 * that is handled by #updateQueryPrefix().
 *
 * Requires the element to be passed in so we can get the current attribute values.
 */
export function setQueryStringFromState(
  provider: KeyMapUIState,
  kmui: KeyMapUI
) {
  const queryPrefix = provider.queryPrefix;

  if (!queryPrefix) {
    return;
  }
  const newParams = new URLSearchParams(window.location.search);

  const tBoardElement = provider.keyboardElementName;
  const tMap = provider.keymapId;
  const tLayer = provider.layer;
  const tKey = provider.selectedKey;

  const aBoardElement = kmui.getAttribute("keyboard-element") || "";
  const aMap = kmui.getAttribute("keymap-id") || "";
  const aLayer = parseInt(kmui.getAttribute("layer") || "0", 10);
  const aKey = kmui.getAttribute("selected-key") || "";

  if (tBoardElement && aBoardElement !== tBoardElement) {
    newParams.set(`${queryPrefix}-board`, tBoardElement);
  } else {
    newParams.delete(`${queryPrefix}-board`);
  }

  if (tMap && aMap !== tMap) {
    newParams.set(`${queryPrefix}-map`, tMap);
  } else {
    newParams.delete(`${queryPrefix}-map`);
  }

  if (tLayer && aLayer !== tLayer) {
    newParams.set(`${queryPrefix}-layer`, tLayer.toString());
  } else {
    newParams.delete(`${queryPrefix}-layer`);
  }

  if (tKey && aKey !== tKey) {
    newParams.set(`${queryPrefix}-key`, tKey);
  } else {
    newParams.delete(`${queryPrefix}-key`);
  }

  const newUrl =
    newParams.toString() !== ""
      ? `${window.location.pathname}?${newParams.toString()}`
      : `${window.location.pathname}`;

  if (window.location.search !== `?${newUrl}`) {
    window.history.replaceState({}, "", newUrl);
  }
}
