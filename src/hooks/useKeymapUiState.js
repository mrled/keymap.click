import { useRouter } from "next/router";
import {
  createContext,
  useState,
} from "react";

import log from "loglevel";

import {
  QueryState,
  setQueryState,
} from "~/lib/appQueryState";
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";

const GuideState = new QueryState("guide", "none");
const GuideStepState = new QueryState("guideStep", 0);
const HelpState = new QueryState("help", false)
const LegendMapState = new QueryState("legendMap", "MrlLegends");
const KeyMapState = new QueryState("keyMap", "DebugLayout");
const SelectedKeyState = new QueryState("keyId", null);

/* A table for looking up the state object by its key
 * E.g. stateByKey.guide === GuideState
 */
const stateByKey = [
  GuideState,
  GuideStepState,
  HelpState,
  KeyMapState,
  LegendMapState,
  SelectedKeyState,
].reduce((acc, cur) => Object.assign(acc, { [cur.key]: cur }), {});

const KeymapUiStateDefault = {
  guide: null,
  guideStep: null,
  help: false,
  keyId: null,
  keyMap: null,
  legendMap: null,
}

/* Compare two keymapUiState objects
 */
const keymapUiStateEq = (state1, state2) => {
  return Object.keys(KeymapUiStateDefault).every(key => state1[key] === state2[key])
}

/* Convert a keymapUiState object of name=value to an array of [QueryState, value] pairs
 *
 * Used for working with setQueryState().
 *
 * Look up the QueryState object in stateByKey.
 *
 * For instance, if the stateObj is
 * {
 *   'keyMap': 'DebugLayout',
 *   'legendMap': 'unicode',
 * }
 * return a two dimensional array of
 * [
 *   [KeyMapState, 'DebugLayout'],
 *   [LegendMapState, 'UnicodeLegends'],
 * ]
 */
const stateObjToQueryStringPair = (stateObj) => {
  return Object.entries(stateObj).map(([key, value]) => [stateByKey[key], value]);
}

/* Given a dict with only scalar values, return the objects we care about
 *
 * Useful because we store simple scalars like strings and numbers in the query string,
 * and pull them out when the page loads.
 * But ultimately the application needs objects those strings represent;
 * this function converts the one to the other.
 */
const hydrateState = (state) => {
  const keyMap = keyMaps[state.keyMap || KeyMapState.defaultValue];
  const legendMap = legendMaps[state.legendMap || LegendMapState.defaultValue];
  const guide = keyMap.guides[state.guide || GuideState.defaultValue];

  const keyData = keyMap.allKeysById[state.keyId] || {};

  const guidesAvailable = Object.entries(keyMap.guides).length > 1; // NOTE: in keys.js, we define a "none" guide for every keyMap.
  const guideStepIdx = Number(state.guideStep || GuideStepState.defaultValue);
  const inGuide = guide.name !== GuideState.defaultValue
  const guideStep = inGuide ? guide.steps[guideStepIdx] : {};

  const nextGuideStepIdx = guideStepIdx + 1;
  const canIncrementGuideStep = inGuide ? nextGuideStepIdx < guide.steps.length : false;
  const prevGuideStepIdx = guideStepIdx - 1;
  const canDecrementGuideStep = inGuide ? prevGuideStepIdx >= 0 : false;
  const guideLength = inGuide ? guide.steps.length : 0;
  const onFinalGuideStep = inGuide && guideStepIdx + 1 == guideLength;

  return {
    keyMap,
    legendMap,
    guide,

    keyData,

    guidesAvailable,
    guideStepIdx,
    guideStep,
    inGuide,

    nextGuideStepIdx,
    canIncrementGuideStep,
    prevGuideStepIdx,
    canDecrementGuideStep,
    guideLength,
    onFinalGuideStep,
  }
}

export const KeymapUiStateContext = createContext(KeymapUiStateDefault);

export const useKeymapUiState = () => {
  const router = useRouter();
  const [keymapUiState, setKeymapUiState] = useState(KeymapUiStateDefault);
  const hydratedState = hydrateState(keymapUiState);

  /* Set display state and query in one go
   */
  const setStateAndQuery = (newData) => {
    log.trace(
      `setStateAndQuery():\n`,
      `Old state: ${JSON.stringify(keymapUiState)}\n`,
      `Old query: ${JSON.stringify(router.query)}\n`,
      `New data:  ${JSON.stringify(newData)}`,
    );
    setKeymapUiState({
      ...keymapUiState,
      ...newData,
    });
    setQueryState(
      router,
      ...stateObjToQueryStringPair(newData),
    );
  };

  /* Set the React state from the query string values
   */
  const setStateFromQuery = () => {
    if (!keymapUiStateEq(keymapUiState, router.query)) {
      log.debug(`Setting state from query\nold state: ${JSON.stringify(keymapUiState)}\nnew state: ${JSON.stringify(router.query)}`)
      setKeymapUiState({
        ...router.query,
      });
    } else {
      log.debug(`Not necessary to set state from query; internal state already reflects query string of\n${JSON.stringify(router.query)}`)
    }
  }

  const setGuide = (guideName) => {
    setStateAndQuery({
      guide: guideName ? guideName : GuideState.defaultValue,
      guideStep: GuideStepState.defaultValue,
      keyId: guideName ? hydratedState.keyMap.guides[guideName].steps[0].key : SelectedKeyState.defaultValue,
      help: false,
    });
    return hydratedState.guide;
  };

  const incrementGuideStep = () => {
    setStateAndQuery({
      guideStep: hydratedState.nextGuideStepIdx,
      keyId: hydratedState.guide.steps[hydratedState.nextGuideStepIdx].key,
      help: false,
    });
  };
  const decrementGuideStep = () => {
    setStateAndQuery({
      guideStep: hydratedState.prevGuideStepIdx,
      keyId: hydratedState.guide.steps[hydratedState.prevGuideStepIdx].key,
      help: false,
    });
  };

  const setKeyMap = (keyMapName) => {
    setStateAndQuery({
      guide: GuideState.defaultValue,
      guideStep: GuideStepState.defaultValue,
      keyMap: keyMapName ? keyMapName : KeyMapState.defaultValue,
      help: false,
    });
  };

  const setLegendMap = (legendMapName) => {
    setStateAndQuery({
      legendMap: legendMapName,
      help: false,
    });
  };

  const setKeyId = (keyId) => {
    setStateAndQuery({
      keyId: keyId || SelectedKeyState.defaultValue,
      guide: GuideState.defaultValue,
      guideStep: GuideStepState.defaultValue,
      help: false,
    });
  };

  const setHelp = (newValue) => {
    setStateAndQuery({
      help: Boolean(newValue),
    })
  };

  return {
    // Properties
    state: keymapUiState,
    hydratedState,

    // Setters
    setStateFromQuery,
    setKeyId,
    setKeyMap,
    setLegendMap,
    setGuide,
    incrementGuideStep,
    decrementGuideStep,
    setHelp,
  };
}
