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
      <div className="flex flex-row lg:mt-56">
        <div className="flex flex-row ml-auto">
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
        <div className="flex flex-row-reverse mr-auto">
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

  /* When pressedKey changes, update the diagram
   */

  return (
    <>
      <div
        className="my-8 md:my-24 mx-auto text-sm md:text-base p-4"
        id="keyblay-debug-outer-wrapper-div"
      >
        <div className="w-full h-full" id="keyblay-debug-content-wrapper-div">
          <div className="w-full md:mr-8 md:px-4 z-10">
            <div className="fixed bottom-0 top-auto lg:absolute lg:bottom-auto lg:top-0 left-0 right-0 border border-gray-300 bg-gray-100 rounded-md p-4 mb-4 mx-auto">
              <div className="container mx-auto">
                <InfoPanel
                  keyData={pressedKey}
                  keyButtonOnClick={() => setPressedKey({})}
                />
              </div>
            </div>
            {renderKeyboard()}
          </div>
          {/* We place the canvas last and therefore we do not need to specify a z-index -
           * it is naturally on top of the other content.
           */}
          <Diagram connections={connections} />
        </div>
      </div>
    </>
  );
};
