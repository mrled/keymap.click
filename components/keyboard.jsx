import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { leftHandKeys, leftThumbKeys, rightHandKeys, rightThumbKeys } from "../lib/keys";

export const Keyboard = () => {
  const [pressedKey, setPressedKey] = useState({});

  const allKeys = leftHandKeys.slice(0).concat(leftThumbKeys, rightHandKeys, rightThumbKeys)
  allKeys.forEach((key, idx) => {
    key.idx = idx
  })

  const handleKeyDown = e => {
    e.keyCode === 9 && e.preventDefault();
    const found = allKeys.find(key => key.keyCode === e.keyCode);
    if (!found) return;
    setPressedKey(found);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const infoText = () => {
    return (<>
      <h2 className="text-2xl">Key information</h2>
      {pressedKey.info ? (
        `${pressedKey.key}: ${pressedKey.info}`
      ) : (
        "Select a key"
      )}
    </>)
  }

  /* Return a list of elements to represent keys on the keyboard.
   * Includes both <button> elements for actual keys,
   * as well as blank <div> elements for empty spaces on the keyboard.
   */
  const keyButtons = (keybKey) => {
    const {
      idx,
      key,
      size=[2, 2],
      startPos=['auto', 'auto'],
      fontSize="text-xl",
    } = keybKey
    const [col, row] = size
    const [colStart, rowStart] = startPos
    return key !== null ? (
      <button
        key={idx}
        onClick={() => setPressedKey(keybKey)}
        className={classnames(
          `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart} hover:bg-blue-600 bg-blue-700 text-white cursor-pointer p-1 flex justify-center items-center rounded-sm ${fontSize} font-mono`,
          {
            "bg-gray-400 border border-blue-500 shadow-outline": false, /* TODO: should be true when this key is selected */
            "bg-gray-200 border border-gray-500 focus:outline-none": true /* TODO: should be true when this key is not selected */
          }
        )
      }
      >{key}</button>
    ) : (
      <div
        key={idx}
        className={`col-span-${col} row-span-${row} col-start-auto row-start-auto`}
      />
    )
  }

  const boardSection = (floatOrientation, sectionTitle, cols, rows, keys) => {
    return (<>
      <div className={classnames(`float-${floatOrientation}`)}>
        <h2 className="text-2xl text-blue-600">{sectionTitle}</h2>
        <div className={classnames(`grid grid-cols-${cols}-keyb grid-rows-${rows}-keyb p-5`)}>
          {keys.map(keyButtons)}
        </div>
      </div>
    </>)
  }

  const infoTextBox = () => {
    return (<>
      <footer className="sticky bottom-0 left-0 w-full border-t bg-gray-600 text-white border-grey p-4">
        {infoText()}
      </footer>
    </>)
  }

  return (<>
    <div className="flex flex-col h-full">
      {boardSection('left', 'Left hand board', 15, 10, leftHandKeys)}
      {boardSection('right', 'Left thumb cluster', 6, 6, leftThumbKeys)}
      {boardSection('right', 'Right hand board', 15, 10, rightHandKeys)}
      {boardSection('left', 'Right thumb cluster', 6, 6, rightThumbKeys)}
      {infoTextBox()}
    </div>
  </> )
}
