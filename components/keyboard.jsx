import { useState, useRef, useEffect } from "react";
import classnames from "classnames";

import {
  leftHandKeys,
  leftThumbKeys,
  rightHandKeys,
  rightThumbKeys,
} from "../lib/keys";
import { Key } from "./key";
import {
  parseKeyInfo,
  KeyInfo,
  KeyInformation,
} from "./keyInfo";
import { LineCanvas } from "./diagram";

const IntroText = () => {
  return (
    <div className="pb-20">
      <h1 className="text-3xl pb-8 mb-8 debug-bg-orange-disabled">
        keyblay: Experiments in keyboard layouts
      </h1>
      <p className="p-1 debug-bg-orange-disabled">This is a work in progress.</p>
      <p className="p-1 debug-bg-orange-disabled">
        I am building this to show off keyboard layouts for my ErgoDox, and
        provide explanations for why I made the layout decisions I made. The
        ErgoDox-EZ has been a huge part of my strategy for dealing with RSI,
        and I want to be able to visually explain to others how it helped
        me.
      </p>
      <p className="p-1 debug-bg-orange-disabled">
        I am building it on GitHub. Issues and contributions welcome.{" "}
        <a
          className="text-blue-600 underline"
          href="https://github.com/mrled/keyblay"
        >
          https://github.com/mrled/keyblay
        </a>
      </p>
    </div>
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
const KeyboardGrid = ({ cols, rows, keys, onClickEach=()=>{}, gridAppendClasses=""} ) => {
  return (
    <>
      <div
        className={classnames(
          `grid grid-cols-${cols}-keyb grid-rows-${rows}-keyb`,
          gridAppendClasses,
        )}
      >
        {keys.map((keyData) => {
          return (
            <Key id={keyData.id} key={keyData.reactKey} keyData={keyData} onClick={() => {onClickEach(keyData)}} />
          );
        })}
      </div>
    </>
  )
}

export const Keyboard = ({ maxWidth=1024 }) => {
  const [pressedKey, setPressedKey] = useState({});

  const allKeys = leftHandKeys
    .slice(0)
    .concat(leftThumbKeys, rightHandKeys, rightThumbKeys);
  allKeys.forEach((keyData, idx) => {
    const side = keyData.board[0] == "right" ? "r" : "l";
    const cluster = keyData.board[1] == "finger" ? "f" : "t";
    const keyId = `${side}-${cluster}-${keyData.startPos[0]}-${keyData.startPos[1]}`;
    keyData.reactKey = keyId;
    keyData.id = keyId;
  });

  const handleKeyDown = (e) => {
    e.keyCode === 9 && e.preventDefault();
    const found = allKeys.find((key) => key.keyCode === e.keyCode);
    if (!found) return;
    setPressedKey(found);
  };

  /* useEffect runs code when the page renders
   * <https://reactjs.org/docs/hooks-effect.html>
   * This means you can interact with the DOM itself in it, via e.g. document.getElementById(...)
   */

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []); // Passing an empty array means to call useEffect only once, when page first renders

  useEffect(() => {
    const renderedKeyPointers = document.getElementsByClassName('key-info-connect-from')
    var lines = []
    for (let keyPointer of renderedKeyPointers) {
      const sourceCoords = keyPointer.getBoundingClientRect()
      const kicfPrefix = 'key-info-connect-from-'  // TODO: can I put magic string like this in a central place somewhere?
      const targetKeyIds = keyPointer
        .className
        .split(' ')
        .filter(cls => cls.startsWith(kicfPrefix))
        .map(cls => cls.slice(kicfPrefix.length))
      targetKeyIds.forEach(targetKeyId => {
        const targetKey = document.getElementById(targetKeyId)
        const targetCoords = targetKey.getBoundingClientRect()
        console.log(`Draw on the canvas from source at ${sourceCoords.x}, ${sourceCoords.y} to dest key with ID ${targetKeyId} at ${targetCoords.x},${targetCoords.y}`)
        lines.push([sourceCoords, targetCoords])
      })
    }
  }, [pressedKey]) // Passing pressedKey in this array means to call useEffect every time pressedKey changes state

  const parsedPressedKeyInfo = parseKeyInfo(pressedKey.info);

  return (
    <>
      <div
        style={{maxWidth: {maxWidth}}}
        className="my-8 md:my-24 container mx-auto text-sm md:text-base p-4 debug-bg-red-disabled"
      >
        <div className="w-full h-full debug-bg-purple-disabled">
          <div className="flex flex-col md:flex-row relative debug-border-purple-disabled">
            <div className="w-full md:w-4/6 md:mr-8 md:px-4 relative debug-border-green-disabled">
              <IntroText />
              {/* TODO: thumb clusters partially occlude the GUI key on each half b/c of rotation */}
              <div className="flex flex-row debug-bg-teal-disabled">
                <div className="flex flex-row">
                  <KeyboardGrid cols="15" rows="10" keys={leftHandKeys} onClickEach={setPressedKey} />
                  <KeyboardGrid cols="6" rows="6" keys={leftThumbKeys} onClickEach={setPressedKey} gridAppendClasses="keyboard-left-thumb-cluster" />
                </div>
                <div className="flex flex-row-reverse">
                  <KeyboardGrid cols="15" rows="10" keys={rightHandKeys} onClickEach={setPressedKey} />
                  <KeyboardGrid cols="6" rows="6" keys={rightThumbKeys} onClickEach={setPressedKey} gridAppendClasses="keyboard-right-thumb-cluster" />
                </div>
              </div>
            </div>
            <div
              className={classnames(
                "w-full h-auto md:h-full right-0 left-0 md:left-auto md:w-4/12 md:mh-screen-90 md:t-20 fixed md:sticky debug-bg-yellow-disabled",
                {
                  "bottom-0": pressedKey.info,
                  "hidden md:block": !pressedKey.info,
                }
              )}
            >
              <div
                style={{ maxHeight: "calc(100vh - 20px)" }}
                className="border border-gray-300 bg-gray-100 rounded-md p-4 pb-8 md:p-4 md:pt-2 mx-2 md:mx-none"
              >
                <KeyInfo keyData={pressedKey} parsedKeyInfo={parsedPressedKeyInfo} keyButtonOnClick={() => setPressedKey({})} />
              </div>
            </div>

          </div>
          {/* Initially I also had this styling, copied from the sister div:
            * md:w-4/6 md:mr-8 md:px-4
            */}
          <div className="w-full absolute pointer-events-none h-full debug-border-red-disabled top-0 left-0">
              <LineCanvas  />
          </div>

        </div>
      </div>
    </>
  );
};
