import React, {
  useContext,
} from "react";

import {
  GuidedTourButtons,
} from "~/components/guidance";
import { IntraAppLink } from "~/components/intraAppLink";
import {
  KeyGrid,
  Legend,
} from "~/components/key";
import {
  parseKeyInfo,
} from "~/lib/keyInfoParser";
import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";

const GuideInfo = ({ inGuide = false, guideStep = 0, guideLength = 0 }) => {
  const ordinalGuideStep = guideStep + 1;
  const duringGuideText = `Guided tour step ${ordinalGuideStep} of ${guideLength}`;
  const availableGuideText = `Guided tour`;
  if (guideLength == 0) {
    return <></>
  } else {
    return <>
      <p className="text-xs">{inGuide ? duringGuideText : availableGuideText}</p>
      <GuidedTourButtons />
    </>
  }
}

/* A navigation bar for the KeyInfoPanel
 * Include an entire <KeyGrid> just large enough to hold the largest key.
 */
const KeyInfoNavBar = ({ keyData, legendMap, guideInfo }) => {
  let modifiedKeyData = Object.assign({}, keyData);
  modifiedKeyData.startPos = [0, 0];

  return (
    <div className="border-b pb-2 mb-2 flex">

      <div className="flex-col px-4">
        <KeyGrid
          // Use a constant size so that elements below/right of this one
          // don't change location when we select different keys
          cols="3"
          rows="4"
          keys={[modifiedKeyData]}
          legends={legendMap}
          pressedKey={keyData}
        />
      </div>

      <div className="flex-col px-4 ">
        <h2 className="text-sm md:text-2xl">Key information</h2>
        {guideInfo ? guideInfo : <></>}
      </div>
    </div >
  );
}

const TextLabelHeader = ({ label }) => {
  if (label) {
    return (
      <p className="py-2">
        The <span className="font-mono text-gray-600 px-1">{label}</span> key
      </p>
    );
  } else {
    return (
      <p className="py-2">An unset key</p>
    );
  }
}

/* Text for key info
 */
const KeyInfoProse = ({ isSet, keyInfo, textLabel }) => {
  return (
    <div className="py-5">
      <TextLabelHeader label={isSet ? textLabel : null} />
      <p className="py-2">{parseKeyInfo(keyInfo)}</p>
    </div>
  );
}

/* A legend attribution footnote
 */
const LegendAttribution = ({ legendData }) => {
  if (legendData.attrib) {
    return (
      <div className="text-2xs">
        <h2>Legend Attribution:</h2>
        <p>{legendData.attrib}</p>
      </div>
    );
  } else {
    return <></>
  }
}

/* A <KeyInfo> component styled nicely for the parent <Keyboard> component.
 */
const KeyInfo = ({ keyData, legendMap, guideInfo }) => {
  const legend = Legend(legendMap[keyData.legend]);
  return (
    <>
      <KeyInfoNavBar keyData={keyData} legendMap={legendMap} guideInfo={guideInfo} />
      <KeyInfoProse isSet={!keyData.unset} keyInfo={keyData.info} textLabel={keyData.name || legend.legend} />
      <LegendAttribution legendData={legend} />
    </>
  );
};

/* An information panel about whatever key/guide we're in, or with an intro
 */
export const InfoPanel = () => {
  const { hydratedState, setGuide } = useContext(KeymapUiStateContext);
  if (hydratedState.keyData.info) {
    /* If in a guide:
     *   Navigation: title: Keymap Name Guided Tour, Step N/X: <key>, buttons: <prev>, <next>, <exit>, <help>
     *   <help> popover that says: it's a tour, next/prev work normally,
     *     to exit the tour click on any key or the exit, see menu to read about this site
     * If not in a guide:
     *   Navigation: title: Key information for <key>, buttons: <help>
     *   <help> popover that says: enter tour to be given a guided tour, see menu to read about this site
     */
    const guideInfo = hydratedState.inGuide ? (
      <GuideInfo
        guideStep={hydratedState.guideStepIdx}
        guideLength={hydratedState.guide.steps.length}
        inGuide={hydratedState.inGuide}
      />
    ) : (null);
    return (
      <KeyInfo
        keyData={hydratedState.keyData}
        legendMap={hydratedState.legendMap}
        guideInfo={guideInfo}
      />
    );
  } else {
    /* Navigation: title: Welcome, buttons: <help>
     * <help> popover that says: enter tour to be given a guided tour, see menu to read about this site
     * Text: please select a key or enter the guided tour
     * Alternatively: use the same help content as <help> popovers above?
     */
    return (
      <div>
        <h1 className="text-2xl pb-4">
          Welcome
      </h1>
        <p className="p-1">You are viewing the keymap information for: {hydratedState.keyMap.fullName}.</p>
        <p className="p-1">Select a key from the list above to learn more about it.</p>
        {hydratedState.keyMap.defaultGuide ? (
          <p className="p-1">Not sure where to begin? <button
            className="p-1 m-1 border border-gray-300 bg-gray-200"
            onClick={() => { setGuide(hydratedState.keyMap.defaultGuide); }}
            disabled={!hydratedState.keyMap.defaultGuide}
          >Start a guided tour!</button></p>
        ) : <></>
        }
        <p className="p-1">
          <IntraAppLink href="/about">What is this?</IntraAppLink>
        </p>
      </div>
    );
  }
};
