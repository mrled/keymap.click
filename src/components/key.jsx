import React, { useContext } from "react";

import classnames from "classnames";
import log from "loglevel";

import {
  keyHandleDomIdFromKeyId,
} from "~/lib/keyConnections"

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
const KeyHandle = ({ keyId, colStart, handleTop, extraClasses }) => {
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

  const classes = `h-1 w-1 m-0 p-0 border-none pointer-events-none absolute ${extraClasses}`;
  return <>
    <div id={keyHandleDomIdFromKeyId(keyId)} style={style} className={classes} />
  </>;
};

/* Process a legend object from lib/keys.js,
 * and return a Legend object that can be used inside of a Key
 */
export const Legend = (legend) => {
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

/* A keyboard key
 * Properties:
 *   keyData:           An object e.g. from lib/keys.js
 *   legend:            A Legend object
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
  legend,
  onClick = null,
  standalone = false,
  id = null,
  active = false,
  otherSelected = false,
  targetKeyActive = false,
  keyHandleExtraClasses = null,
}) => {
  const {
    size = [2, 2],
    startPos = ["auto", "auto"],
    extraClasses = "",
    handleTop = false,
  } = keyData;
  const [col, row] = size;
  const [colStart, rowStart] = startPos;

  const gridClasses = `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart}`;
  const standaloneClasses = `standalone-key standalone-key-w-${col} standalone-key-h-${row}`;

  const classes = classnames(
    standalone ? standaloneClasses : gridClasses,
    `cursor-pointer p-1 flex justify-center items-center rounded-sm font-mono pointer-events-auto force-outline-none relative`,
    {
      "bg-orange-400 border border-orange-700 hover:bg-orange-600": active,
      "bg-orange-200 border border-orange-500 hover:bg-orange-400": otherSelected,
      "bg-green-200 border border-green-500 hover:bg-green-400": !active && targetKeyActive,
      "bg-gray-200 border border-gray-500 hover:bg-gray-400": !active && !otherSelected && !targetKeyActive,
    },
    {
      [legend.fontFace]: legend.fontFace,
      [legend.fontSize]: legend.fontSize,
    },
    extraClasses
  );

  return (
    <button id={id} onClick={onClick} className={classes}>
      <KeyHandle keyId={id} colStart={colStart} handleTop={handleTop} extraClasses={keyHandleExtraClasses} />
      {legend.legend}
    </button>
  );

};

/* Return a grid of <Key> components
 * cols: The number of columsn in the grid
 * rows: Number of rows in the grid
 * keys: List of key data objects (e.g. lib/keys.js)
 * legends: Legend map we are using
 * onClickEach: Optional function to call onClick for each <Key> component
 *   It will be called with the key data object as the first argument
 * appendClasses: Optional string containing classes to append to the parent grid <div>
 */
export const KeyGrid = ({
  gridName = "",
  cols,
  rows,
  keys,
  legends,
  pressedKey,
  onClickEach = () => { },
  gridAppendClasses = "",
  targetKeyIds = [],
  keySelection = [],
}) => {
  log.debug(`Building keyGrid '${gridName}' with pressedKey:\n${JSON.stringify(pressedKey)}`);
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
            isInSelectedGroup = !isActive && keySelection.indexOf(keyData.id) > -1;
          } else {
            isActive = false;
            isInSelectedGroup = false;
          }
          return (
            <Key
              id={keyData.id}
              legend={Legend(legends[keyData.legend])}
              targetKeyActive={isTargetKey}
              active={isActive}
              otherSelected={isInSelectedGroup}
              key={keyData.reactKey}
              keyData={keyData}
              onClick={() => onClickEach(keyData.id)}
              keyHandleExtraClasses={keyData.keyHandleExtraClasses || null}
            />
          );
        })}
      </div>
    </>
  );
};
