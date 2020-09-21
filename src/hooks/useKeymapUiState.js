import { useRouter } from "next/router";
import { createContext, useCallback, useState } from "react";

import { QueryState, setQueryState } from "~/lib/appQueryState";
import { objectTableCompare } from "~/lib/consoleLogHelper";
import { keyMaps, legendMaps } from "~/lib/keys";

const GuideState = new QueryState("guide", "none");
const GuideStepState = new QueryState("guideStep", 0);
const LegendMapState = new QueryState("legendMap", "MrlLegends");
const KeyMapState = new QueryState("keyMap", "MrlMainLayer");
const SelectedKeyState = new QueryState("keyId", null);

/* Prevent unnecessary redraws
 */
const emptyIdempotentStateObject = {};

/* A table for looking up the state object by its key
 * E.g. stateByKey.guide === GuideState
 */
const stateByKey = [
  GuideState,
  GuideStepState,
  KeyMapState,
  LegendMapState,
  SelectedKeyState,
].reduce((acc, cur) => Object.assign(acc, { [cur.key]: cur }), {});

/* The default value for keymapUiState
 *
 * Unset values should be _undefined_, not null or something else.
 * This allows us to compare them with router.query directly,
 * because router.query[SomethingNotPresent] === undefined.
 */
const KeymapUiStateDefault = {
  guide: undefined,
  guideStep: undefined,
  keyId: undefined,
  keyMap: undefined,
  legendMap: undefined,
};

/* Compare two keymapUiState objects
 */
const keymapUiStateEq = (state1, state2) => {
  return Object.keys(KeymapUiStateDefault).every(
    (key) => state1[key] === state2[key]
  );
};

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
  return Object.entries(stateObj).map(([key, value]) => [
    stateByKey[key],
    value,
  ]);
};

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

  const keyData = keyMap.allKeysById[state.keyId] || emptyIdempotentStateObject;

  const guidesAvailable = Object.entries(keyMap.guides).length > 1; // NOTE: in keys.js, we define a "none" guide for every keyMap.
  const guideStepIdx = Number(state.guideStep || GuideStepState.defaultValue);
  const inGuide = guide.name !== GuideState.defaultValue;
  const guideStep = inGuide
    ? guide.steps[guideStepIdx]
    : emptyIdempotentStateObject;

  const nextGuideStepIdx = guideStepIdx + 1;
  const canIncrementGuideStep = inGuide
    ? nextGuideStepIdx < guide.steps.length
    : false;
  const prevGuideStepIdx = guideStepIdx - 1;
  const canDecrementGuideStep = inGuide ? prevGuideStepIdx >= 0 : false;
  const guideLength = inGuide ? guide.steps.length : 0;
  const onFinalGuideStep = inGuide && guideStepIdx + 1 == guideLength;

  const keySelection = inGuide ? guideStep.selection : keyData.selection;

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

    keySelection,
  };
};

export const KeymapUiStateContext = createContext(KeymapUiStateDefault);

export const useKeymapUiState = () => {
  const router = useRouter();
  const [keymapUiState, setKeymapUiState] = useState(KeymapUiStateDefault);

  const hydrateStateCallback = useCallback(() => hydrateState(keymapUiState), [
    keymapUiState,
  ]);

  const hydratedState = hydrateStateCallback(keymapUiState);

  /* Set display state and query in one go
   */
  const setStateAndQuery = useCallback(
    (newData) => {
      console.trace(`setStateAndQuery():`);
      console.table(
        objectTableCompare(
          [keymapUiState, router.query, newData],
          ["keymapUiState", "router.query", "newData"]
        )
      );
      setKeymapUiState({
        ...keymapUiState,
        ...newData,
      });
      setQueryState(router, ...stateObjToQueryStringPair(newData));
    },
    [keymapUiState, router]
  );

  /* Set the React state from the query string values
   */
  const setStateFromQuery = () => {
    if (!keymapUiStateEq(keymapUiState, router.query)) {
      console.log("Setting state from query");
      console.table(
        objectTableCompare(
          [keymapUiState, router.query],
          ["keymapUiState", "router.query"]
        )
      );
      setKeymapUiState({
        ...router.query,
      });
    } else {
      console.log(
        "Not necessary to set state from query; internal state already reflects query string of",
        router.query
      );
    }
  };

  const setGuide = useCallback(
    (guideName) => {
      setStateAndQuery({
        guide: guideName ? guideName : GuideState.defaultValue,
        guideStep: GuideStepState.defaultValue,
        keyId: guideName
          ? hydratedState.keyMap.guides[guideName].steps[0].key
          : SelectedKeyState.defaultValue,
      });
      return hydratedState.guide;
    },
    [hydratedState.guide, hydratedState.keyMap.guides, setStateAndQuery]
  );

  const incrementGuideStep = useCallback(() => {
    setStateAndQuery({
      guideStep: hydratedState.nextGuideStepIdx,
      keyId: hydratedState.guide.steps[hydratedState.nextGuideStepIdx].key,
    });
  }, [
    hydratedState.guide.steps,
    hydratedState.nextGuideStepIdx,
    setStateAndQuery,
  ]);
  const decrementGuideStep = useCallback(() => {
    setStateAndQuery({
      guideStep: hydratedState.prevGuideStepIdx,
      keyId: hydratedState.guide.steps[hydratedState.prevGuideStepIdx].key,
    });
  }, [
    hydratedState.guide.steps,
    hydratedState.prevGuideStepIdx,
    setStateAndQuery,
  ]);

  const setKeyMap = useCallback(
    (keyMapName) => {
      setStateAndQuery({
        guide: GuideState.defaultValue,
        guideStep: GuideStepState.defaultValue,
        keyMap: keyMapName ? keyMapName : KeyMapState.defaultValue,
      });
    },
    [setStateAndQuery]
  );

  const setLegendMap = useCallback(
    (legendMapName) => {
      setStateAndQuery({
        legendMap: legendMapName,
      });
    },
    [setStateAndQuery]
  );

  const setKeyId = useCallback(
    (keyId) => {
      setStateAndQuery({
        keyId: keyId || SelectedKeyState.defaultValue,
        guide: GuideState.defaultValue,
        guideStep: GuideStepState.defaultValue,
      });
    },
    [setStateAndQuery]
  );

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
  };
};
