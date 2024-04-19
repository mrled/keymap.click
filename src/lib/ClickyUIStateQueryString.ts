/* Synchronize the query string and a state object
 */

import { ClickyUIElement } from "~/webcomponents/clicky-ui";
import { IClickyUIStateIdArgs, ClickyUIState } from "./ClickyUIState";

// TODO: support guide and guide step parameters

/* Read the query string and update the state of the ClickyUIElement.
 *
 * Arguments:
 * - state: the ClickyUIState object
 * - clickyUi: the ClickyUIElement object, which is used to get the current attribute values
 */
export function setStateFromQsAndAttrib({
  state,
  clickyUi,
}: {
  state: ClickyUIState;
  clickyUi?: ClickyUIElement;
}): (keyof ClickyUIState)[] {
  // If the query prefi is already set in the state, use it as a default value.
  // That should not be the case if clickyUi is passed (see below), though we don't enforce that.
  let queryPrefix = state.queryPrefix;

  // If the clickyUi is passed, we are setting the state on initial load.
  // The clickyUi will pass itself to this function in its connectedCallback() only,
  // so that this function can configure the state based on its attributes and query string.
  // This will change the state to reflect what's in the attributes,
  // and then override those attributes if the query string has different values.
  // We don't want to pass the clickyUi parameter in any other situation,
  // because normally we don't want to override the state with the attributes.
  const currentAttributes: IClickyUIStateIdArgs = {};
  if (clickyUi) {
    if (clickyUi.hasAttribute("query-prefix")) {
      queryPrefix = clickyUi.getAttribute("query-prefix") || "";
      currentAttributes.queryPrefix = queryPrefix;
    }
    if (clickyUi.hasAttribute("keyboard-element")) {
      currentAttributes.keyboardElementName =
        clickyUi.getAttribute("keyboard-element") || "";
    }
    if (clickyUi.hasAttribute("keymap-id")) {
      currentAttributes.keymapId = clickyUi.getAttribute("keymap-id") || "";
    }
    if (clickyUi.hasAttribute("layer")) {
      currentAttributes.layerIdx = parseInt(
        clickyUi.getAttribute("layer") || "0",
        10
      );
    }
    if (clickyUi.hasAttribute("selected-key")) {
      currentAttributes.selectedKey =
        clickyUi.getAttribute("selected-key") || "";
    }
  }

  const qsArgs: IClickyUIStateIdArgs = {};
  if (queryPrefix) {
    const currentParams = new URLSearchParams(window.location.search);
    const qDebug = currentParams.get("debug");
    const qBoard = currentParams.get(`${queryPrefix}-board`);
    const qMap = currentParams.get(`${queryPrefix}-map`);
    const qLayer = currentParams.get(`${queryPrefix}-layer`);
    const qKey = currentParams.get(`${queryPrefix}-key`);
    const qGuide = currentParams.get(`${queryPrefix}-guide`);
    const qStep = currentParams.get(`${queryPrefix}-step`);
    if (qDebug) {
      qsArgs.debug = qDebug === "true" ? 1 : 0;
    }
    if (qBoard) {
      qsArgs.keyboardElementName = qBoard;
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
  const newStateArgs: IClickyUIStateIdArgs = {
    ...currentAttributes,
    ...qsArgs,
  };
  state.setStatesByIds(newStateArgs);

  // Return the keys that were defined in the query string or attributes.
  // This list doesn't take into account what the initial state values were,
  // just what was set by the query string or attributes,
  // so it may include keys that were already set to the same value.
  return Object.keys(newStateArgs) as (keyof ClickyUIState)[];
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
  state: ClickyUIState,
  clickyUi: ClickyUIElement
) {
  const queryPrefix = state.queryPrefix;

  if (!queryPrefix) {
    return;
  }
  const newParams = new URLSearchParams(window.location.search);

  const tBoardElement = state.kbModel.keyboardElementName;
  const tMap = state.keymap.uniqueId;
  const tLayer = state.layer;
  const tLayerIdx = state.keymap.layers.indexOf(tLayer);
  const tKey = state.selectedKey;
  const tGuide = state.guide?.id;
  const tStep = state.guideStep?.index;

  const aBoardElement = clickyUi.getAttribute("keyboard-element") || "";
  const aMap = clickyUi.getAttribute("keymap-id") || "";
  const aLayer = parseInt(clickyUi.getAttribute("layer") || "0", 10);
  const aKey = clickyUi.getAttribute("selected-key") || "";
  const aGuide = clickyUi.getAttribute("guide-id") || "";
  const aGuideStep = parseInt(clickyUi.getAttribute("guide-step") || "0", 10);

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
