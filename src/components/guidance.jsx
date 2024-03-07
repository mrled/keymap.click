import React, { useContext, useRef } from "react";

import classnames from "classnames";
import log from "loglevel";

import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";

const GuideBarButton = ({
  children = null,
  enabled = true,
  onClick = () => {},
}) => {
  let classes = "guide-bar-button";
  if (enabled) {
    classes += " guide-bar-button-enabled";
  }
  return (
    <button className={classes} onClick={onClick} disabled={!enabled}>
      {children}
    </button>
  );
};

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
    >
      Prev
    </GuideBarButton>
  );
  const nextButton = (
    <GuideBarButton
      onClick={() => incrementGuideStep()}
      enabled={hydratedState.canIncrementGuideStep}
    >
      Next
    </GuideBarButton>
  );
  const doneButton = (
    <GuideBarButton
      onClick={() => {
        setGuide(null);
      }}
      enabled={hydratedState.inGuide}
    >
      Finish
    </GuideBarButton>
  );
  const exitButton = (
    <GuideBarButton
      onClick={() => {
        setGuide(null);
      }}
      enabled={hydratedState.inGuide}
    >
      Exit
    </GuideBarButton>
  );
  const startButton = (
    <GuideBarButton
      onClick={() => {
        setGuide(hydratedState.keyMap.defaultGuide);
      }}
      enabled={!hydratedState.inGuide && hydratedState.keyMap.defaultGuide}
    >
      Start
    </GuideBarButton>
  );
  let finalButton;
  if (!hydratedState.inGuide) {
    finalButton = startButton;
  } else if (hydratedState.onFinalGuideStep) {
    finalButton = doneButton;
  } else {
    finalButton = exitButton;
  }
  return (
    <>
      {prevButton}
      {nextButton}
      {finalButton}
    </>
  );
};
