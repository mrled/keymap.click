
import React, {
  useContext,
} from "react";

import {
  GuidedTourButtons,
} from "~/components/guidance";
import {
  KeyGrid,
  Legend,
} from "~/components/key";
import {
  IntraAppLink,
  Para,
} from "~/components/prose";
import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
  keyInfoConnectType,
  keyInfoConnectTypeClassPrefix,
} from "~/lib/keyConnections";
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


const PanelNavBar = ({ tbKeyGrid, title, guideInfo }) => {
  return (
    <div className="border-b">
      <div className="flex">
        <div className="flex-col px-4">
          {tbKeyGrid}
        </div>

        <div className="flex-col ml-auto px-4">
          <h2 className="text-lg md:text-2xl">{title}</h2>
        </div >
      </div >

      <div className="p-1">
        {guideInfo ? guideInfo : <></>}
      </div>
    </div>
  );
}

/* Text for key info
 *
 * Must handle several possible states:
 *   - User selected a regular key
 *   - User selected a key that is unset / blank
 *   - Guide selected a regular key
 *   - Guide selected a key that is unset / blank
 *   - Guide is active but a key is not selected
 */
const KeyInfoProse = ({ isSet, textLabel, keyInfo, inGuide, noSelectedGuideKey }) => {
  let labelHeader;
  if (inGuide && noSelectedGuideKey) {
    labelHeader = <></>;
  } else if (isSet) {
    labelHeader = <Para>The <kbd>{textLabel}</kbd> key</Para>;
  } else if (!isSet) {
    labelHeader = <Para>An unset key</Para>;
  }
  return (
    <div className="py-5">
      {labelHeader}
      {keyInfo}
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

/* A tiny key grid just for use in the title bar of the info panel
 */
const TitleBarKeyGrid = ({ keyData, legendMap }) => {
  let modifiedKeyData = Object.assign({}, keyData);
  modifiedKeyData.startPos = [0, 0];
  const modifiedKeyId = "title-bar-0-0";
  modifiedKeyData.reactKey = modifiedKeyId;
  modifiedKeyData.id = modifiedKeyId;
  return (
    <KeyGrid
      gridName="title bar"
      // Use a constant size so that elements below/right of this one
      // don't change location when we select different keys
      cols="3"
      rows="4"
      keys={[modifiedKeyData]}
      legends={legendMap}
      pressedKey={modifiedKeyData}
    />
  );
}

/* An empty KeyGrid for the title bar.
 */
const EmptyTitleBarKeyGrid = () => {
  const emptyTbKeyData = { reactKey: 1 }; // Stave off React warnings
  return <TitleBarKeyGrid keyData={emptyTbKeyData} legendMap={{}} />;
}

/* A KeyGrid for the title bar which references a key on the keyboard
 */
const PopulatedTitleBarKeyGrid = ({ keyData, legendMap }) => {
  const modifiedKeyData = { ...keyData };
  modifiedKeyData.keyHandleExtraClasses = [
    `${keyInfoConnectFromClass}`,
    `${keyInfoConnectTypeClassPrefix}${keyInfoConnectType.selected}`,
    `${keyInfoConnectFromClassPrefix}${keyData.id}`
  ].join(' ');
  return <TitleBarKeyGrid keyData={modifiedKeyData} legendMap={legendMap} />;
}

/* An information panel about whatever key/guide we're in, or with an intro
 */
export const InfoPanel = () => {
  const { hydratedState, setGuide } = useContext(KeymapUiStateContext);
  const { keyData, legendMap } = hydratedState;
  const legend = Legend(legendMap[keyData.legend]);

  const keyDataTbKeyGrid = keyData.id ? <PopulatedTitleBarKeyGrid keyData={keyData} legendMap={legendMap} /> : <EmptyTitleBarKeyGrid />

  if (hydratedState.inGuide) {
    // We are in a guide. There may be a selected key, but maybe not.
    const guideInfo = <GuideInfo
      guideStep={hydratedState.guideStepIdx}
      guideLength={hydratedState.guide.steps.length}
      inGuide={hydratedState.inGuide}
    />;
    return (<>
      <PanelNavBar
        tbKeyGrid={keyDataTbKeyGrid}
        title={hydratedState.guideStep.title || "Key information"}
        guideInfo={guideInfo}
      />
      <KeyInfoProse
        isSet={!keyData.unset}
        inGuide={true}
        noSelectedGuideKey={!hydratedState.guideStep.key}
        keyInfo={hydratedState.guideStep.text || keyData.info}
        textLabel={keyData.name || legend.legend || null}
      />
      <LegendAttribution legendData={legend} />
    </>);

  } else if (hydratedState.keyData.info) {
    // We are NOT in a guide, but the user has selected a key
    return (<>
      <PanelNavBar
        tbKeyGrid={keyDataTbKeyGrid}
        title="Key information"
      />
      <KeyInfoProse isSet={!keyData.unset} keyInfo={keyData.info} textLabel={keyData.name || legend.legend} />
      <LegendAttribution legendData={legend} />
    </>);
  } else {
    // No key is selected and we are not in a guide
    return (
      <>
        <PanelNavBar
          tbKeyGrid={<EmptyTitleBarKeyGrid />}
          title="Welcome"
          guideInfo={null}
        />
        {/* <Para>You are viewing the keymap information for: {hydratedState.keyMap.fullName}.</Para> */}
        <Para>
          Welcome to <IntraAppLink href="/">keymap.click</IntraAppLink>!
          I built this site to show how my <IntraAppLink href="/ergodox">keyboard</IntraAppLink> helped my RSI.
        </Para>
        <Para>Select a key from the list above to learn more about it.</Para>
        {hydratedState.keyMap.defaultGuide ? (
          <Para>
            Not sure where to begin?
            <button
              className="p-1 m-1 border border-gray-300 rounded-md bg-gray-200"
              onClick={() => { setGuide(hydratedState.keyMap.defaultGuide); }}
              disabled={!hydratedState.keyMap.defaultGuide}
            >Start a guided tour!
          </button>
          </Para>
        ) : <></>
        }
      </>
    );
  }
};
