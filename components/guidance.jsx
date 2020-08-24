import { useRouter } from "next/router";
import React, {
  useRef,
} from "react";

import classnames from "classnames";
import log from "loglevel";

import {
  GuideState,
  GuideStepState,
  KeyMapState,
  setQueryState,
} from "~/lib/appQueryState";
import {
  keyMaps,
} from "~/lib/keys";

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
  const router = useRouter();
  const currentGuideName = GuideState.getValue(router);
  const currentGuideStep = GuideStepState.getValue(router);
  const currentKeyMapName = KeyMapState.getValue(router);
  const keyMap = keyMaps[currentKeyMapName];
  const currentGuide = currentGuideName ? keyMap.guides[currentGuideName] : GuideState.defaultValue;
  const inGuide = currentGuideName !== GuideState.defaultValue;

  const nextStepIdx = Number(currentGuideStep) + 1;
  const nextStepAvail = currentGuide ? nextStepIdx <= currentGuide.steps.length : false;
  const prevStepIdx = Number(currentGuideStep) - 1;
  const prevStepAvail = currentGuide ? prevStepIdx >= 0 : false;

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
            setQueryState(router, [GuideState, event.target.value], [GuideStepState, 0]);
          }}
          defaultValue={GuideState.getValue(router)}
          name="Guides"
          id="guide-selector"
          className="p-2 m-2 w-1/3"
          ref={guideSelectBox}
        >
          {Object.keys(keyMap.guides).map((guideName) => {
            console.log(`Building list, default value '${GuideState.getValue(router)}' processing guide '${guideName}'`)
            return <option key={guideName} value={guideName}>{keyMap.guides[guideName].fullName}</option>
          })}
        </select>

        <div className="block md:inline">
          <GuideBarButton
            onClick={() => { setQueryState(router, [GuideStepState, prevStepIdx]); }}
            enabled={prevStepAvail}
          >Prev</GuideBarButton>

          <GuideBarButton
            onClick={() => { setQueryState(router, [GuideStepState, nextStepIdx]); }}
            enabled={nextStepAvail}
          >Next</GuideBarButton>

          <GuideBarButton
            onClick={() => {
              if (!guideSelectBox || !guideSelectBox.current) return;
              guideSelectBox.current.value = GuideState.defaultValue;
              setQueryState(router, [GuideState, GuideState.defaultValue]);
            }}
            enabled={inGuide}
          >Exit</GuideBarButton>

        </div>
      </div>

    </>
  );
}
