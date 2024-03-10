import React from "react";

import { useWhyDidYouUpdate } from "~/hooks/useWhyDidYouUpdate";
import { Key } from "~/webcomponents/reactWrapper";

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
        const { size = [2, 2], startPos = ["auto", "auto"], legend } = keyData;
        const position = `${size[0]} ${size[1]} ${startPos[0]} ${startPos[1]}`;
        const legendData = legends[keyData.legend];
        let legendText = "";
        let legendImage = "";
        // TODO: don't differentiate between text and glyph here
        if (legendData && legendData.image) {
          legendImage = "legends/" + legendData.image.value;
        } else if (legendData && legendData.glyph) {
          if (Array.isArray(legendData.glyph.value)) {
            legendText = legendData.glyph.value.join("");
          } else {
            legendText = legendData.glyph.value;
          }
        } else if (legendData && legendData.text) {
          legendText = legendData.text.value;
        }
        return (
          <Key
            position={position}
            legend-text={legendText}
            legend-image={legendImage}
            onClick={() => onClickEach(keyData.id)}
            standalone={false}
            id={keyData.id}
            active={isActive}
            other-selected={isInSelectedGroup}
            target-key-active={isTargetKey}
            key-handle-extra-classes={keyData.keyHandleExtraClasses || ""}
            key-handle-top={keyData.keyHandleTop}
            // This is the React key, nothing to do with keyboard keys.
            // https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
            key={keyData.reactKey}
          />
        );
      })}
    </div>
  );
};
