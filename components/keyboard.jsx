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

  const keyClassNames = (col, row, colStart, rowStart) => {
    return classnames(
      `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart} hover:bg-gray-400 cursor-pointer p-1 flex justify-center items-center rounded-sm text-xs`,
      {
        "bg-gray-400 border border-blue-500 shadow-outline": false, /* TODO: should be true when this key is selected */
        "bg-gray-200 border border-gray-500 focus:outline-none": true /* TODO: should be true when this key is not selected */
      }
    )
  }

  const keyButtons = (keybKey) => {
    const {
      idx,
      key,
      size=[2, 2],
      startPos=['auto', 'auto'],
    } = keybKey
    const [col, row] = size
    const [colStart, rowStart] = startPos
    return key !== null ? (
      <button
        key={idx}
        onClick={() => setPressedKey(keybKey)}
        className={keyClassNames(col, row, colStart, rowStart)}
      >{key}</button>
    ) : (
      <div
        key={idx}
        className={`col-span-${col} row-span-${row} col-start-auto row-start-auto`}
      />
    )
  }

  const leftHandBoard = () => {
    return (<>
      <div className="float-left">
        <h2 className="text-2xl">Left hand board</h2>
        <div className="grid grid-cols-15-keyb grid-rows-10-keyb p-5">
          {leftHandKeys.map(keyButtons)}
        </div>
      </div>
    </>)
  }

  const leftThumbBoard = () => {
    return (<>
      <div className="float-right">
        <h2 className="text-2xl">Left thumb cluster</h2>
        <div className="grid grid-cols-6-keyb grid-rows-6-keyb p-5">
          {leftThumbKeys.map(keyButtons)}
        </div>
      </div>
    </>)
  }
  const rightHandBoard = () => {
    return (<>
      <div className="float-right">
        <h2 className="text-2xl">Right hand board</h2>
        <div className="grid grid-cols-15-keyb grid-rows-10-keyb p-5">
          {rightHandKeys.map(keyButtons)}
        </div>
      </div>
    </>)
  }

  const rightThumbBoard = () => {
    return (<>
      <div className="float-left">
        <h2 className="text-2xl">Right thumb cluster</h2>
        <div className="grid grid-cols-6-keyb grid-rows-6-keyb p-5">
          {rightThumbKeys.map(keyButtons)}
        </div>
      </div>
    </>)
  }

  return (
    <div>
      <div className="pb-12">{infoText()}</div>
      {leftHandBoard()}
      {leftThumbBoard()}
      {rightHandBoard()}
      {rightThumbBoard()}
    </div>
  )
}
