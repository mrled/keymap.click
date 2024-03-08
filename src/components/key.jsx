import React from "react";

import { useWhyDidYouUpdate } from "~/hooks/useWhyDidYouUpdate";
import { keyHandleDomIdFromKeyId } from "~/lib/keyConnections";

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

  return (
    <>
      <div
        id={keyHandleDomIdFromKeyId(keyId)}
        style={style}
        className={`key-handle ${extraClasses}`}
      />
    </>
  );
};

/* Process a legend object from lib/keys.js,
 * and return a Legend object that can be used inside of a Key
 */
export const Legend = (legend) => {
  const defaultFontFace = "font-roboto-mono"; // TODO: remove-tailwind
  const defaultGlyphFontSize = "text-m md:text-m"; // TODO: remove-tailwind
  const defaultTextFontSize = "text-2xs md:text-xs"; // TODO: remove-tailwind

  if (!legend) {
    return {};
  } else if (legend.image) {
    return {
      legend: (
        <>
          <img src={`legends/${legend.image.value}`} className="key-legend" />
        </>
      ),
      attrib: legend.image.attrib || "",
    };
  } else if (legend.glyph) {
    return {
      legend: legend.glyph.value,
      fontSize: legend.glyph.fontSize || defaultGlyphFontSize,
      fontFace: legend.glyph.fontFace || defaultFontFace,
      attrib: "",
    };
  } else if (legend.text) {
    return {
      legend: legend.text.value,
      fontSize: legend.text.fontSize || defaultTextFontSize,
      fontFace: legend.text.fontFace || defaultFontFace,
      attrib: "",
    };
  } else {
    return {};
  }
};

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

  // The style prop if this key is being rendered in a grid
  const gridStyleProp = {
    gridColumnStart: colStart,
    gridRowStart: rowStart,
    gridColumnEnd: `span ${col}`,
    gridRowEnd: `span ${row}`,
  };

  // The style prop if this key is being rendered as a standalone key
  const standaloneStyleProp = {
    width: `calc(var(--keyboard-grid-unit) * ${col})`,
    height: `calc(var(--keyboard-grid-unit) * ${row})`,
  };

  const style = standalone ? standaloneStyleProp : gridStyleProp;

  const gridClasses = ``;
  const standaloneClasses = `standalone-key`;

  let classes = "keyboard-key";
  classes += standalone ? standaloneClasses : gridClasses;
  if (active) {
    classes += " active-key";
  } else if (otherSelected) {
    classes += " related-to-active-key";
  } else if (targetKeyActive) {
    classes += " diagram-target-key";
  }

  // TODO: remove-tailwind
  if (legend.fontFace) {
    classes += ` ${legend.fontFace}`;
  }
  if (legend.fontSize) {
    classes += ` ${legend.fontSize}`;
  }

  if (extraClasses) {
    classes += ` ${extraClasses}`;
  }

  return (
    <button id={id} onClick={onClick} className={classes} style={style}>
      <KeyHandle
        keyId={id}
        colStart={colStart}
        handleTop={handleTop}
        extraClasses={keyHandleExtraClasses}
      />
      {legend.legend}
    </button>
  );
};

/* Return a grid of <Key> components
 * cols: The number of columns in the grid
 * rows: Number of rows in the grid
 * keys: List of key data objects (e.g. lib/keys.js)
 * legends: Legend map we are using
 * onClickEach: Optional function to call onClick for each <Key> component
 *   It will be called with the key data object as the first argument
 * appendClasses: Optional string containing classes to append to the parent grid <div>
 */
export const KeyGrid = (props) => {
  const {
    gridName = "",
    cols,
    rows,
    keys,
    legends,
    pressedKey,
    onClickEach = () => {},
    gridAppendClasses = "",
    targetKeyIds = [],
    keySelection = [],
  } = props;
  useWhyDidYouUpdate(`KeyGrid '${gridName}'`, props);
  return (
    <div
      className={`keygrid ${gridAppendClasses}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, var(--keyboard-grid-unit))`,
        gridTemplateRows: `repeat(${rows}, var(--keyboard-grid-unit))`,
      }}
    >
      {keys.map((keyData) => {
        const isTargetKey =
          targetKeyIds.findIndex((id) => id === keyData.id) > -1;
        let isActive, isInSelectedGroup;
        if (pressedKey) {
          isActive = keyData.id === pressedKey.reactKey;
          isInSelectedGroup =
            !isActive && keySelection.indexOf(keyData.id) > -1;
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
  );
};
