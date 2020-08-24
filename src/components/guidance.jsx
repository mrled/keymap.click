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
  SelectedKeyState,
  setQueryState,
} from "~/lib/appQueryState";
import {
  keyMaps,
} from "~/lib/keys";

export const getCurrentGuideStep = () => {
  const router = useRouter()
  const keyMapName = KeyMapState.getValue(router);
  const keyMap = keyMaps[keyMapName];
  const guideName = GuideState.getValue(router);
  const guideStepIdx = Number(GuideStepState.getValue(router));
  const guide = keyMap.guides[guideName];
  const currentGuideStep = guide.steps[guideStepIdx];
  return currentGuideStep;
}

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
  const currentStepIdx = Number(GuideStepState.getValue(router));
  const currentKeyMapName = KeyMapState.getValue(router);
  const keyMap = keyMaps[currentKeyMapName];
  const currentGuide = currentGuideName ? keyMap.guides[currentGuideName] : GuideState.defaultValue;

  const inGuide = currentGuideName !== GuideState.defaultValue;

  const nextStepIdx = currentStepIdx + 1;
  const nextStepAvail = currentGuide ? nextStepIdx < currentGuide.steps.length : false;
  const nextStep = currentGuide.steps[nextStepIdx]
  const prevStepIdx = currentStepIdx - 1;
  const prevStepAvail = currentGuide ? prevStepIdx >= 0 : false;
  const prevStep = currentGuide.steps[prevStepIdx]

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
            return <option key={guideName} value={guideName}>{keyMap.guides[guideName].fullName}</option>
          })}
        </select>

        <div className="block md:inline">
          <GuideBarButton
            onClick={() => {
              setQueryState(
                router,
                [GuideStepState, prevStepIdx],
                [SelectedKeyState, prevStep.key],
              );
            }}
            enabled={prevStepAvail}
          >Prev</GuideBarButton>

          <GuideBarButton
            onClick={() => {
              setQueryState(
                router,
                [GuideStepState, nextStepIdx],
                [SelectedKeyState, nextStep.key],
              );
            }}
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
