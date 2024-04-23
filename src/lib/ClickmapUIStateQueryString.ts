/* Synchronize the query string and a state object
 */

import { ClickmapUIElement } from "~/webcomponents/clickmap-ui";
import { IClickmapUIStateIdArgs, ClickmapUIState } from "./ClickmapUIState";

/* Read the query string and update the state of the ClickmapUIElement.
 *
 * Arguments:
 * - state: the ClickmapUIState object
 * - clickmapUi: the ClickmapUIElement object, which is used to get the current attribute values
 */
export function setStateFromQsAndAttrib({
  state,
  clickmapUi,
}: {
  state: ClickmapUIState;
  clickmapUi?: ClickmapUIElement;
}): (keyof ClickmapUIState)[] {
  // If the query prefi is already set in the state, use it as a default value.
  // That should not be the case if clickmapUi is passed (see below), though we don't enforce that.
  let queryPrefix = state.queryPrefix;

  // If the clickmapUi is passed, we are setting the state on initial load.
  // The clickmapUi will pass itself to this function in its connectedCallback() only,
  // so that this function can configure the state based on its attributes and query string.
  // This will change the state to reflect what's in the attributes,
  // and then override those attributes if the query string has different values.
  // We don't want to pass the clickmapUi parameter in any other situation,
  // because normally we don't want to override the state with the attributes.
  const currentAttributes: IClickmapUIStateIdArgs = {};
  if (clickmapUi) {
    if (clickmapUi.hasAttribute("query-prefix")) {
      queryPrefix = clickmapUi.getAttribute("query-prefix") || "";
      currentAttributes.queryPrefix = queryPrefix;
    }
    if (clickmapUi.hasAttribute("keymap-id")) {
      currentAttributes.keymapId = clickmapUi.getAttribute("keymap-id") || "";
    }
    if (clickmapUi.hasAttribute("layer")) {
      currentAttributes.layerIdx = parseInt(
        clickmapUi.getAttribute("layer") || "0",
        10
      );
    }
    if (clickmapUi.hasAttribute("selected-key")) {
      currentAttributes.selectedKey =
        clickmapUi.getAttribute("selected-key") || "";
    }
  }

  const qsArgs: IClickmapUIStateIdArgs = {};
  if (queryPrefix) {
    const currentParams = new URLSearchParams(window.location.search);
    const qDebug = currentParams.get("debug");
    const qMap = currentParams.get(`${queryPrefix}-map`);
    const qLayer = currentParams.get(`${queryPrefix}-layer`);
    const qKey = currentParams.get(`${queryPrefix}-key`);
    const qGuide = currentParams.get(`${queryPrefix}-guide`);
    const qStep = currentParams.get(`${queryPrefix}-step`);
    if (qDebug) {
      qsArgs.debug = qDebug === "true" ? 1 : 0;
    }
    if (qMap) {
      qsArgs.keymapId = qMap;
    }
    if (qLayer) {
      qsArgs.layerIdx = parseInt(qLayer, 10);
    }
    if (qKey) {
      qsArgs.selectedKey = qKey;
    }
    if (qGuide) {
      qsArgs.guideId = qGuide;
    }
    if (qStep) {
      qsArgs.guideStepIdx = parseInt(qStep, 10);
    }
  }

  // Merge the changes from the attributes and the query string into a single object, and apply them to the state.
  const newStateArgs: IClickmapUIStateIdArgs = {
    ...currentAttributes,
    ...qsArgs,
  };
  state.setStatesByIds(newStateArgs);

  // Return the keys that were defined in the query string or attributes.
  // This list doesn't take into account what the initial state values were,
  // just what was set by the query string or attributes,
  // so it may include keys that were already set to the same value.
  return Object.keys(newStateArgs) as (keyof ClickmapUIState)[];
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
  state: ClickmapUIState,
  clickmapUi: ClickmapUIElement
) {
  const queryPrefix = state.queryPrefix;

  if (!queryPrefix) {
    return;
  }
  const newParams = new URLSearchParams(window.location.search);

  const tMap = state.keymap.uniqueId;
  const tLayer = state.layer;
  const tLayerIdx = state.keymap.layers.indexOf(tLayer);
  const tKey = state.selectedKey;
  const tGuide = state.guide?.id;
  const tStep = state.guideStep?.index;

  const aMap = clickmapUi.getAttribute("keymap-id") || "";
  const aLayer = parseInt(clickmapUi.getAttribute("layer") || "0", 10);
  const aKey = clickmapUi.getAttribute("selected-key") || "";
  const aGuide = clickmapUi.getAttribute("guide-id") || "";
  const aGuideStep = parseInt(clickmapUi.getAttribute("guide-step") || "0", 10);

  if (tMap && tMap !== state.defaultKeymap.uniqueId && aMap !== tMap) {
    newParams.set(`${queryPrefix}-map`, tMap);
  } else {
    newParams.delete(`${queryPrefix}-map`);
  }

  if (tLayer && aLayer !== tLayerIdx) {
    newParams.set(`${queryPrefix}-layer`, tLayerIdx.toString());
  } else {
    newParams.delete(`${queryPrefix}-layer`);
  }

  if (tKey && aKey !== tKey) {
    newParams.set(`${queryPrefix}-key`, tKey);
  } else {
    newParams.delete(`${queryPrefix}-key`);
  }

  if (tGuide && aGuide !== tGuide) {
    newParams.set(`${queryPrefix}-guide`, tGuide);
  } else {
    newParams.delete(`${queryPrefix}-guide`);
  }

  if (tStep && aGuideStep !== tStep) {
    newParams.set(`${queryPrefix}-step`, tStep.toString());
  } else {
    newParams.delete(`${queryPrefix}-step`);
  }

  const newUrl =
    newParams.toString() !== ""
      ? `${window.location.pathname}?${newParams.toString()}`
      : `${window.location.pathname}`;

  if (window.location.search !== `?${newUrl}`) {
    window.history.replaceState({}, "", newUrl);
  }
}
