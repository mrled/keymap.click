import { useState, useRef, useEffect } from "react";
import { useWindowSize } from "../lib/hooks";
import classnames from "classnames";
import log from "loglevel";

import {
  leftHandKeys,
  leftThumbKeys,
  rightHandKeys,
  rightThumbKeys,
} from "../lib/keys";
import { useKeyConnections } from "../lib/keyConnections";
import { Diagram } from "./diagram";
import { InfoPanel } from "./infoPanel";
import { KeyGrid } from "./key";

export const Keyboard = () => {
  const [pressedKey, setPressedKey] = useState({});
  const [otherSelectedKeys, setOtherSelectedKeys] = useState([]);
  const windowSize = useWindowSize();
  const { connections, targetKeyIds } = useKeyConnections([
    pressedKey,
    windowSize,
  ]);

  const setPressedAndSelectedKeys = (keyData) => {
    setPressedKey(keyData);
    setOtherSelectedKeys(keyData.selection);
  };

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

  const renderKeyboard = () => {
    return (
      <div className="flex flex-col md:flex-row mt-0">
        <div className="flex flex-col">
          <h2 className="text-xl">Left hand</h2>
          <div className="flex flex-row">
            <KeyGrid
              cols="15"
              rows="10"
              keys={leftHandKeys}
              pressedKey={pressedKey}
              selectedKeys={otherSelectedKeys}
              targetKeyIds={targetKeyIds}
              onClickEach={setPressedAndSelectedKeys}
            />
            <KeyGrid
              cols="6"
              rows="6"
              keys={leftThumbKeys}
              pressedKey={pressedKey}
              selectedKeys={otherSelectedKeys}
              targetKeyIds={targetKeyIds}
              onClickEach={setPressedAndSelectedKeys}
              gridAppendClasses="keyboard-left-thumb-cluster"
            />
          </div>
        </div>

        <div className="flex flex-col mt-20 md:mt-0">
          <h2 className="text-xl ml-auto">Right hand</h2>
          <div className="flex flex-row-reverse">
            <KeyGrid
              cols="15"
              rows="10"
              keys={rightHandKeys}
              pressedKey={pressedKey}
              selectedKeys={otherSelectedKeys}
              targetKeyIds={targetKeyIds}
              onClickEach={setPressedAndSelectedKeys}
            />
            <KeyGrid
              cols="6"
              rows="6"
              keys={rightThumbKeys}
              pressedKey={pressedKey}
              selectedKeys={otherSelectedKeys}
              targetKeyIds={targetKeyIds}
              onClickEach={setPressedAndSelectedKeys}
              gridAppendClasses="keyboard-right-thumb-cluster"
            />
          </div>
        </div>
      </div>
    );
  };

  /* useEffect runs code when the page renders
   * <https://reactjs.org/docs/hooks-effect.html>
   * This means you can interact with the DOM itself in it, via e.g. document.getElementById(...)
   * You can call useEffect() more than once, even for the same event.
   */

  /* Add a handler for the keydown event
   */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []); // Passing an empty array means to call useEffect only once, when page first renders

  return (
    <>
      <div
        className="w-full h-full text-sm md:text-base p-4 flex"
        id="keyblay-debug-outer-wrapper-div"
      >
        <div className="w-full md:mr-8 md:px-4 z-10">
          <div className="bottom-auto top-0 left-0 right-0 border border-gray-300 bg-gray-100 rounded-md p-4 mb-4 mx-auto">
            <InfoPanel
              keyData={pressedKey}
              keyButtonOnClick={() => setPressedKey({})}
            />
          </div>
          {renderKeyboard()}
        </div>
        {/* We place the canvas last and therefore we do not need to specify a z-index -
         * it is naturally on top of the other content.
         */}
        <Diagram connections={connections} />
      </div>
    </>
  );
};
