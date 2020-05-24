import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { leftHandKeys } from "../lib/keys";

export const Keyboard = () => {
  const [pressedKey, setPressedKey] = useState({});

  const allKeys = leftHandKeys

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
    if (pressedKey.key && pressedKey.info) {
      return `${pressedKey.key}: ${pressedKey.info}`
    } else {
      return "Select a key"
    }
  }

  const keyClassNames = (col, row, colStart, rowStart) => {
    return classnames(
      `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart} hover:bg-gray-400 cursor-pointer p-1 flex justify-center items-center rounded-sm`,
      {
        "bg-gray-400 border border-blue-500 shadow-outline": false, /* TODO: should be true when this key is selected */
        "bg-gray-200 border border-gray-500 focus:outline-none": true /* TODO: should be true when this key is not selected */
      }
    )
  }

  const keyButtons = (keybKey) => {
    const {
      key,
      size=[2, 2],
      startPos=['auto', 'auto'],
    } = keybKey
    const [col, row] = size
    const [colStart, rowStart] = startPos
    return key !== null ? (
      <button
        onClick={() => setPressedKey(keybKey)}
        className={keyClassNames(col, row, colStart, rowStart)}
      >{key}</button>
    ) : (
      <div
        className={`col-span-${col} row-span-${row} col-start-auto row-start-auto`}
      />
    )
  }

  const leftHandBoard = () => {
    return (
      <div className="grid grid-cols-15 grid-rows-10 ">
        {leftHandKeys.map(keyButtons)}
      </div>
    )
  }

  return (
    <div>
      <div className="pb-12">{infoText()}</div>
      {leftHandBoard()}
    </div>
  )
}
