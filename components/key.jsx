import { useRouter } from "next/router";
import React, {
  useContext,
} from "react";

import classnames from "classnames";

import {
  KeyboardSettingsContext,
} from "~/components/appContext";
import {
  GuideState,
  GuideStepState,
  KeyMapState,
} from "~/lib/appQueryState";
import {
  keyHandleDomIdFromKeyId,
} from "~/lib/keyConnections"
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";

/* This is a small element used as an anchor point to connect a diagram line to this key.
 *
 * We use this because it is transformed with the outer element,
 * for instance the thumb clusters are moved and rotated,
 * and this div is to relatively the same place within its parent <Key> during that transformation.
 *
 * The parent <Key> element is large enough that when it rotates, its BoundingClientRect is enlarged,
 * so the calculation we were doing before of a few px from the top left was actually outside of
 * the rotated <Key> element itself.
 *
 * Technically, this little <div> will have the same problem - its BoundingClientRect is enlarged.
 * However, it is so small that this doesn't matter.
 * The diagram line still looks good inside the <Key>.
 */
const KeyHandle = ({ keyId, colStart, handleTop }) => {
  if (!keyId) {
    return null;
  }

  /* Calculate an offset for the Y dimension.
   * This offset is used to ensure that lines pointing to keys on the same row
   * don't overwrite each other.
   * It's not perfect, but it should be pretty good for non-pathological keymaps.
   */
  const yOffsetValue = colStart;
  const yOffsetMultiplier = handleTop ? -1 : 1;
  const yOffset = yOffsetValue * yOffsetMultiplier;
  const style = {
    transform: `translateY(${yOffset}px)`,
  };

  const classes = "h-1 w-1 m-0 p-0 border-none pointer-events-none absolute";
  return <>
    <div id={keyHandleDomIdFromKeyId(keyId)} style={style} className={classes} />
  </>;
};

/* Process a legend object from lib/keys.js,
 * and return a Legend object that can be used inside of a Key
 */
const Legend = (legend) => {
  const defaultFontFace = "font-roboto-mono"
  const defaultGlyphFontSize = "text-m md:text-m";
  const defaultTextFontSize = "text-2xs md:text-xs";

  if (!legend) {
    return {}
  } else if (legend.image) {
    const [
      width,
      height,
    ] = legend.image.size ? legend.image.size : [4, 4];
    return {
      legend: <>
        <img
          src={`legends/${legend.image.value}`}
          className={`container w-${width} h-${height}`}
        />
      </>,
      attrib: legend.image.attrib || "",
    }
  } else if (legend.glyph) {
    return {
      legend: legend.glyph.value,
      fontSize: legend.glyph.fontSize || defaultGlyphFontSize,
      fontFace: legend.glyph.fontFace || defaultFontFace,
      attrib: "",
    }
  } else if (legend.text) {
    return {
      legend: legend.text.value,
      fontSize: legend.text.fontSize || defaultTextFontSize,
      fontFace: legend.text.fontFace || defaultFontFace,
      attrib: "",
    }
  } else {
    return {}
  }
}

export const keyDataTextLabel = (keyData) => {
  if (keyData.name) {
    return keyData.name;
  }
  const router = useRouter();
  const legendMapName = router.query['legendMap'] || "MrlLegends";
  const legend = Legend(legendMaps[legendMapName][keyData.legend]);
  return legend.legend;
}

export const keyLegendAttrib = (keyData) => {
  const router = useRouter();
  const legendMapName = router.query['legendMap'] || "MrlLegends";
  const legend = Legend(legendMaps[legendMapName][keyData.legend]);
  return legend.attrib;
}

/* A keyboard key
 * Properties:
 *   keyData:           An object e.g. from lib/keys.js
 *   onClick:           An onClick function
 *   standalone:        Return with classes for standalone rendering,
 *                      rather than the default which returns with classes for rendering in a grid
 *   id:                Key id, for drawing diagram lines
 *   active:            True if this key has been selected by the user
 *   otherSelected:     True if this key is a member of the same group as the key selected by the user
 *   targetKeyActive:   True if this key is the target of a diagram liner
 */
export const Key = ({
  keyData,
  onClick = null,
  standalone = false,
  id = null,
  active = false,
  otherSelected = false,
  targetKeyActive = false,
  isGuideStepKey = false,
  isInGuideSelectionGroup = false,
}) => {
  const {
    legend,
    size = [2, 2],
    startPos = ["auto", "auto"],
    extraClasses = "",
    handleTop = false,
  } = keyData;
  const [col, row] = size;
  const [colStart, rowStart] = startPos;

  const router = useRouter();
  const legendMapName = router.query['legendMap'] || "MrlLegends";
  const keyLegendInfo = Legend(legendMaps[legendMapName][legend]);

  const gridClasses = `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart}`;
  const standaloneClasses = `standalone-key standalone-key-w-${col} standalone-key-h-${row}`;
  const classes = classnames(
    standalone ? standaloneClasses : gridClasses,
    `cursor-pointer p-1 flex justify-center items-center rounded-sm font-mono pointer-events-auto force-outline-none relative`,
    {
      /* Background colors:
       * - Darker orange: The selected key
       * - Lighter orange: Other keys in the selection group
       * - Green: Keys that are targets of text in the key info
       * - Darker versions of the above: hover state
       */
      "bg-orange-300 hover:bg-orange-600": active,
      "bg-orange-100 hover:bg-orange-400": otherSelected,
      "bg-green-200 hover:bg-green-400": targetKeyActive,
      "bg-gray-200 hover:bg-gray-400": !active && !otherSelected && !targetKeyActive,

      /* Borders:
       * - Darker red, wide, dotted: The guide step's key
       * - Lighter red, wide, dotted: Other keys in the guide step's selection group
       * - Other colors: darker versions of the background color
       */
      "border-4 border-dashed border-red-700": isGuideStepKey,
      "border-4 border-dashed border-red-300": isInGuideSelectionGroup,
      "border border-orange-700": active && !isGuideStepKey && !isInGuideSelectionGroup,
      "border border-orange-500": otherSelected && !isGuideStepKey && !isInGuideSelectionGroup,
      "border border-green-500": targetKeyActive && !isGuideStepKey && !isInGuideSelectionGroup,
      "border border-gray-500": !active && !otherSelected && !targetKeyActive && !isGuideStepKey && !isInGuideSelectionGroup,
    },
    {
      [keyLegendInfo.fontFace]: keyLegendInfo.fontFace,
      [keyLegendInfo.fontSize]: keyLegendInfo.fontSize,
    },
    extraClasses
  );

  return (
    <button id={id} onClick={onClick} className={classes}>
      <KeyHandle keyId={id} colStart={colStart} handleTop={handleTop} />
      {keyLegendInfo.legend}
    </button>
  );

};

/* Return a grid of <Key> components
 * cols: The number of columsn in the grid
 * rows: Number of rows in the grid
 * keys: List of key data objects (e.g. lib/keys.js)
 * onClickEach: Optional function to call onClick for each <Key> component
 *   It will be called with the key data object as the first argument
 * appendClasses: Optional string containing classes to append to the parent grid <div>
 */
export const KeyGrid = ({
  cols,
  rows,
  keys,
  pressedKey,
  selectedKeys = [],
  onClickEach = () => { },
  gridAppendClasses = "",
  targetKeyIds = [],
}) => {
  const router = useRouter();
  const keyMapName = KeyMapState.getValue(router);
  const guideName = GuideState.getValue(router);
  const guideStepIdx = Number(GuideStepState.getValue(router));
  const keyMap = keyMaps[keyMapName];
  const [keyboardSettings, setKeyboardSettings] = useContext(KeyboardSettingsContext);
  const guide = keyMap.guides[guideName];
  const guideStep = guide.steps[guideStepIdx];

  return (
    <>
      <div
        className={classnames(
          `grid grid-cols-${cols}-keyb grid-rows-${rows}-keyb pointer-events-none select-none`,
          gridAppendClasses
        )}
      >
        {keys.map((keyData) => {

          const isTargetKey = targetKeyIds.findIndex((id) => id === keyData.id) > -1;
          let isActive, isInSelectedGroup;
          if (pressedKey) {
            isActive = keyData.id === pressedKey.reactKey;
            isInSelectedGroup = !isActive && selectedKeys.indexOf(keyData.id) > -1
          } else {
            isActive = false;
            isInSelectedGroup = false;
          }

          let isGuideStepKey, isInGuideSelectionGroup;
          if (guideStep) {
            isGuideStepKey = keyData.id === guideStep.key;
            isInGuideSelectionGroup = !isGuideStepKey &&
              guideStep.selection.indexOf(keyData.id) > -1;
          } else {
            isGuideStepKey = false;
            isInGuideSelectionGroup = false;
          }

          return (
            <Key
              id={keyData.id}
              targetKeyActive={isTargetKey}
              active={isActive}
              otherSelected={isInSelectedGroup}
              key={keyData.reactKey}
              keyData={keyData}
              onClick={() => onClickEach(keyData)}
              isGuideStepKey={isGuideStepKey}
              isInGuideSelectionGroup={isInGuideSelectionGroup}
            />
          );

        })}
      </div>
    </>
  );
};
