
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

const HelpButton = ({ help, setHelp }) => {
  const label = help ? "Close help" : "What is this?"
  return (
    <button
      className="border bg-blue-600 p-2 rounded-md text-white"
      onClick={() => setHelp(!help)}
    >
      {label}
    </button>
  );
}

const PanelNavBar = ({ tbKeyGrid, title, guideInfo, help, setHelp }) => {
  return (
    <div className="border-b pb-2 mb-2 flex">

      <div className="flex-col px-4">
        {tbKeyGrid}
      </div>

      <div className="flex-col px-4 ">
        <h2 className="text-sm md:text-2xl">{title}</h2>
        {guideInfo ? guideInfo : <></>}
      </div>

      <div className=" flex-col ml-auto px-4">
        <HelpButton help={help} setHelp={setHelp} />
      </div >
    </div >
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
    labelHeader = <p className="py-2">
      The <kbd>{textLabel}</kbd> key
    </p>;
  } else if (!isSet) {
    labelHeader = <p className="py-2">An unset key</p>;
  }
  return (
    <div className="py-5">
      {labelHeader}
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

const HelpPanel = ({ hydratedState, setGuide, setHelp }) => {
  return (<div>
    <p>
      I built this site to show how my
      {" "}<IntraAppLink href="/ergodox">ErgoDox keyboard</IntraAppLink>{" "}
      helped my RSI.
    </p>
    <p className="py-1">
      You can select any key on the board above to learn more about why it is placed there.
    </p>
    {
      hydratedState.keyMap.defaultGuide ? (
        <p className="py-1">Not sure where to begin? This keyboard layout supports a guided tour &mdash; <button
          className="p-1 border border-gray-300 rounded-md bg-gray-200"
          onClick={() => setGuide(hydratedState.keyMap.defaultGuide)}
          disabled={!hydratedState.keyMap.defaultGuide}
        >start the tour now!</button></p>
      ) : (
          <p className="py-1">
            Not sure where to begin?
            While the layout you have currently selected does not support a guided tour,
          you might try the guided tour available in the <IntraAppLink href="/">default layout</IntraAppLink>.
          </p>
        )
    }
    <p>
      See also:
    </p>
    <ul className="list-disc my-2 mx-8">
      <li><h2 className="">
        <IntraAppLink href="/about">What is this site?</IntraAppLink>
      </h2></li>
      <li><h2 className="">
        <IntraAppLink href="/ergodox">What kind of keyboard is this?</IntraAppLink>
      </h2></li>
      <li><h2 className="">
        <IntraAppLink href="/story">Personal history</IntraAppLink>
      </h2></li>
    </ul>
  </div >);
}

/* A tiny key grid just for use in the title bar of the info panel
 */
const TitleBarKeyGrid = ({ keyData, legendMap }) => {
  let modifiedKeyData = Object.assign({}, keyData);
  modifiedKeyData.startPos = [0, 0];
  return (
    <KeyGrid
      // Use a constant size so that elements below/right of this one
      // don't change location when we select different keys
      cols="3"
      rows="4"
      keys={[modifiedKeyData]}
      legends={legendMap}
      pressedKey={keyData}
    />
  );
}

/* An information panel about whatever key/guide we're in, or with an intro
 */
export const InfoPanel = () => {
  const { state, hydratedState, setGuide, setHelp } = useContext(KeymapUiStateContext);
  const { keyData, legendMap } = hydratedState;
  const legend = Legend(legendMap[keyData.legend]);

  const emptyTbKeyGrid = <TitleBarKeyGrid keyData={null} legendMap={{}} />

  const helpKeyData = { legend: "?", };
  const helpLegendMap = { "?": { glyph: { value: "¿" } }, }
  const helpTbKeyGrid = <TitleBarKeyGrid keyData={helpKeyData} legendMap={helpLegendMap} />

  if (state.help) {
    // The help panel is open
    return (<>
      <PanelNavBar tbKeyGrid={helpTbKeyGrid} title={"What is this?"} guideInfo={null} help={state.help} setHelp={setHelp} />
      <HelpPanel hydratedState={hydratedState} setGuide={setGuide} setHelp={setHelp} />
    </>);
  } else if (hydratedState.inGuide) {
    // We are in a guide. There may be a selected key, but maybe not.
    const tbKeyGrid = keyData ? <TitleBarKeyGrid keyData={keyData} legendMap={legendMap} /> : emptyTbKeyGrid;
    const guideInfo = <GuideInfo
      guideStep={hydratedState.guideStepIdx}
      guideLength={hydratedState.guide.steps.length}
      inGuide={hydratedState.inGuide}
    />;
    return (<>
      <PanelNavBar
        tbKeyGrid={tbKeyGrid}
        title={"Key information"}
        guideInfo={guideInfo}
        help={state.help}
        setHelp={setHelp}
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
    const tbKeyGrid = <TitleBarKeyGrid keyData={keyData} legendMap={legendMap} />
    return (<>
      <PanelNavBar tbKeyGrid={tbKeyGrid} title={"Key information"} help={state.help} setHelp={setHelp} />
      <KeyInfoProse isSet={!keyData.unset} keyInfo={keyData.info} textLabel={keyData.name || legend.legend} />
      <LegendAttribution legendData={legend} />
    </>);
  } else {
    return (
      <>
        <PanelNavBar tbKeyGrid={emptyTbKeyGrid} title={"Welcome"} guideInfo={null} help={state.help} setHelp={setHelp} />
        <p className="py-1">You are viewing the keymap information for: {hydratedState.keyMap.fullName}.</p>
        <p className="py-1">Select a key from the list above to learn more about it.</p>
        {hydratedState.keyMap.defaultGuide ? (
          <p className="py-1">Not sure where to begin? <button
            className="p-1 m-1 border border-gray-300 rounded-md bg-gray-200"
            onClick={() => { setGuide(hydratedState.keyMap.defaultGuide); }}
            disabled={!hydratedState.keyMap.defaultGuide}
          >Start a guided tour!</button></p>
        ) : <></>
        }
      </>
    );
  }
};
