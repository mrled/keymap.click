import React, { useContext } from "react";
import Link from "next/link";

import { GuidedTourButtons } from "~/components/guidance";
import { KeyGrid } from "~/components/key";
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
    return <></>;
  } else {
    return (
      <>
        <p>{inGuide ? duringGuideText : availableGuideText}</p>
        <GuidedTourButtons />
      </>
    );
  }
};

const PanelNavBar = ({ tbKeyGrid, title, guideInfo }) => {
  return (
    <div className="panel-nav-bar">
      <div className="panel-nav-title">
        {tbKeyGrid}
        <h2>{title}</h2>
      </div>
      {guideInfo ? guideInfo : <></>}
    </div>
  );
};

/* Text for key info
 *
 * Must handle several possible states:
 *   - User selected a regular key
 *   - User selected a key that is unset / blank
 *   - Guide selected a regular key
 *   - Guide selected a key that is unset / blank
 *   - Guide is active but a key is not selected
 */
const KeyInfoProse = ({
  isSet,
  textLabel,
  keyInfo,
  inGuide,
  noSelectedGuideKey,
}) => {
  let labelHeader;
  if (inGuide && noSelectedGuideKey) {
    labelHeader = <></>;
  } else if (isSet) {
    labelHeader = (
      <p>
        The <kbd>{textLabel}</kbd> key
      </p>
    );
  } else if (!isSet) {
    labelHeader = <p>An unset key</p>;
  }
  return (
    <div className="key-info-prose">
      {labelHeader}
      {keyInfo}
    </div>
  );
};

/* A legend attribution footnote
 */
const LegendAttribution = ({ legendData }) => {
  if (legendData.attrib) {
    return (
      <div className="legend-attribution">
        <h2>Legend Attribution:</h2>
        <p>{legendData.attrib}</p>
      </div>
    );
  } else {
    return <></>;
  }
};

/* A tiny key grid just for use in the title bar of the info panel
 */
const TitleBarKeyGrid = ({ keyData, legendMap }) => {
  const titleKeyId = "title-bar-0-0";
  const titleBarKeyDataOverrides = {
    startPos: [0, 0],
    reactKey: titleKeyId,
    id: titleKeyId,
  };
  const modifiedKeyData = Object.assign({}, keyData, titleBarKeyDataOverrides);
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
};

/* An empty KeyGrid for the title bar.
 */
const EmptyTitleBarKeyGrid = () => {
  return <TitleBarKeyGrid keyData={{}} legendMap={{}} />;
};

/* A KeyGrid for the title bar which references a key on the keyboard
 */
const PopulatedTitleBarKeyGrid = ({ keyData, legendMap }) => {
  const modifiedKeyData = { ...keyData };
  modifiedKeyData.keyHandleExtraClasses = [
    `${keyInfoConnectFromClass}`,
    `${keyInfoConnectTypeClassPrefix}${keyInfoConnectType.selected}`,
    `${keyInfoConnectFromClassPrefix}${keyData.id}`,
  ].join(" ");
  return <TitleBarKeyGrid keyData={modifiedKeyData} legendMap={legendMap} />;
};

/* An information panel about whatever key/guide we're in, or with an intro
 */
export const InfoPanel = () => {
  const { hydratedState, setGuide } = useContext(KeymapUiStateContext);
  const { keyData, legendMap } = hydratedState;
  let legend = legendMap[keyData.legend];

  if (!legend) {
    // This can happen for keys left blank
    // console.log(`No legend for keyData: ${keyData.legend}`);
    legend = {};
  }
  let textLabel = keyData.name;
  if (!textLabel) {
    if (legend.text) {
      textLabel = legend.text.value;
    } else if (legend.glyph) {
      textLabel = legend.glyph.value;
    }
  }

  const keyDataTbKeyGrid = keyData.id ? (
    <PopulatedTitleBarKeyGrid keyData={keyData} legendMap={legendMap} />
  ) : (
    <EmptyTitleBarKeyGrid />
  );

  if (hydratedState.inGuide) {
    // We are in a guide. There may be a selected key, but maybe not.
    const guideInfo = (
      <GuideInfo
        guideStep={hydratedState.guideStepIdx}
        guideLength={hydratedState.guide.steps.length}
        inGuide={hydratedState.inGuide}
      />
    );
    return (
      <>
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
          textLabel={textLabel}
        />
        <LegendAttribution legendData={legend} />
      </>
    );
  } else if (hydratedState.keyData.info) {
    // We are NOT in a guide, but the user has selected a key
    return (
      <>
        <PanelNavBar tbKeyGrid={keyDataTbKeyGrid} title="Key information" />
        <KeyInfoProse
          isSet={!keyData.unset}
          keyInfo={keyData.info}
          textLabel={textLabel}
        />
        <LegendAttribution legendData={legend} />
      </>
    );
  } else {
    // No key is selected and we are not in a guide
    return (
      <div className="key-info-panel">
        <PanelNavBar
          tbKeyGrid={<EmptyTitleBarKeyGrid />}
          title="Welcome"
          guideInfo={null}
        />
        <p>
          Welcome to <Link href="/">keymap.click</Link>! I built this site to
          show how my <Link href="/ergodox">keyboard</Link> helped my{" "}
          <Link href="/story">RSI</Link>.
        </p>
        <p>Select a key from the board above to learn more about it.</p>
        {hydratedState.keyMap.defaultGuide ? (
          <p>
            Not sure where to begin?
            <button
              className="start-guided-tour-button"
              onClick={() => {
                setGuide(hydratedState.keyMap.defaultGuide);
              }}
              disabled={!hydratedState.keyMap.defaultGuide}
            >
              Start a guided tour!
            </button>
          </p>
        ) : (
          <></>
        )}
      </div>
    );
  }
};
