import React, {
  useContext,
  useRef,
} from "react";

import classnames from "classnames";
import log from "loglevel";

import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";

const GuideBarButton = ({ children = null, enabled = true, onClick = () => { } }) => {
  return <button
    className={classnames(
      "p-1 m-1 border border-gray-300 w-12 text-xs",
      {
        "text-gray-400": !enabled,
        "bg-gray-200": enabled,
      }
    )}
    onClick={onClick}
    disabled={!enabled}
  >
    {children}
  </button>
}

export const GuidedTourButtons = () => {
  const {
    hydratedState,
    decrementGuideStep,
    incrementGuideStep,
    setGuide,
  } = useContext(KeymapUiStateContext);

  const prevButton = (
    <GuideBarButton
      onClick={() => decrementGuideStep()}
      enabled={hydratedState.canDecrementGuideStep}
    >Prev</GuideBarButton>
  );
  const nextButton = (
    <GuideBarButton
      onClick={() => incrementGuideStep()}
      enabled={hydratedState.canIncrementGuideStep}
    >Next</GuideBarButton>
  );
  const doneButton = (
    <GuideBarButton
      onClick={() => { setGuide(null); }}
      enabled={hydratedState.inGuide}
    >Finish</GuideBarButton>
  )
  const exitButton = (
    <GuideBarButton
      onClick={() => { setGuide(null); }}
      enabled={hydratedState.inGuide}
    >Exit</GuideBarButton>
  );
  const startButton = (
    <GuideBarButton
      onClick={() => { setGuide(hydratedState.keyMap.defaultGuide); }}
      enabled={!hydratedState.inGuide && hydratedState.keyMap.defaultGuide}
    >Start</GuideBarButton>
  )
  let finalButton;
  if (!hydratedState.inGuide) {
    finalButton = startButton;
  } else if (hydratedState.onFinalGuideStep) {
    finalButton = doneButton;
  } else {
    finalButton = exitButton;
  }
  return <>
    {prevButton}
    {nextButton}
    {finalButton}
  </>;
}

export const GuideBar = () => {
  const {
    state,
    hydratedState,
    setGuide,
  } = useContext(KeymapUiStateContext);

  const guideSelectBox = useRef();

  return (
    <>
      <div
        className="border border-gray-300 p-2 m-4 mx-12"
      >

        <label htmlFor="guide-selector" className="p-2 m-2 w-1/3">Guide:</label>
        <select
          onChange={(event) => {
            log.debug(`guide-selector changed to ${event.target.value}`)
            setGuide(event.target.value);
          }}
          defaultValue={state.guide}
          name="Guides"
          id="guide-selector"
          className={classnames(
            "p-2 m-2 w-1/3",
            {
              "text-gray-500": !hydratedState.guidesAvailable,
            }
          )}
          ref={guideSelectBox}
          disabled={!hydratedState.guidesAvailable}
        >
          {Object.keys(hydratedState.keyMap.guides).map((guideName) => {
            return <option key={guideName} value={guideName}>{hydratedState.keyMap.guides[guideName].fullName}</option>
          })}
        </select>

        <div className="block md:inline">
          <GuidedTourButtons />
        </div>
      </div>

    </>
  );
}
