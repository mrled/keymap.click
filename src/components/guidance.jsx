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

export const GuideBar = () => {
  const {
    state,
    hydratedState,
    setGuide,
    decrementGuideStep,
    incrementGuideStep,
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
          className="p-2 m-2 w-1/3"
          ref={guideSelectBox}
        >
          {Object.keys(hydratedState.keyMap.guides).map((guideName) => {
            return <option key={guideName} value={guideName}>{hydratedState.keyMap.guides[guideName].fullName}</option>
          })}
        </select>

        <div className="block md:inline">
          <GuideBarButton
            onClick={() => decrementGuideStep()}
            enabled={hydratedState.canDecrementGuideStep}
          >Prev</GuideBarButton>

          <GuideBarButton
            onClick={() => incrementGuideStep()}
            enabled={hydratedState.canIncrementGuideStep}
          >Next</GuideBarButton>

          <GuideBarButton
            onClick={() => {
              const newGuide = setGuide(null);
              guideSelectBox.current.value = newGuide.name;
            }}
            enabled={hydratedState.inGuide}
          >Exit</GuideBarButton>

        </div>
      </div>

    </>
  );
}
