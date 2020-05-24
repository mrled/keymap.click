import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { keys } from "../lib/keys";

export const Keyboard = () => {
  const [pressedKey, setPressedKey] = useState({});

  const handleKeyDown = e => {
    e.keyCode === 9 && e.preventDefault();
    const found = keys.find(key => key.keyCode === e.keyCode);
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
    } else if (!pressedKey.info) {
        return "Nothing interesting to say. (Don't pick an alphanumeric key.)"
    } else {
      return "Select a key"
    }
  }

  return (
    <div>
      <div className="pb-12">{infoText()}</div>
      <div className="grid grid-cols-15 grid-rows-10 ">
        {keys.map((keybKey, idx) => {
          const {
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
              className={classnames(
                `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart} hover:bg-gray-400 cursor-pointer px-1 py-2 md:p-4 flex justify-center items-center rounded-sm`,
                {
                  "bg-gray-400 border border-blue-500 shadow-outline": false, /* TODO: should be true when this key is selected */
                  "bg-gray-200 border border-gray-500 focus:outline-none": true /* TODO: should be true when this key is not selected */
                }
              )}
            >{key}</button>
          ) : (
            <div
              key={idx}
              className={`col-span-${col} row-span-${row} col-start-auto row-start-auto`}
            />
          )
        })}
      </div>
    </div>
  )
}