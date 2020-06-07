import { useState, useRef, useEffect } from "react";

import classnames from "classnames";
import log from "loglevel";

import {
  leftHandKeys,
  leftThumbKeys,
  rightHandKeys,
  rightThumbKeys,
} from "../lib/keys";
import {
  getKeyConnections,
} from "../lib/keyConnections";
import {
  Diagram,
} from "./diagram";
import {
  IntroText,
} from "./introText";
import {
  KeyGrid,
} from "./key";
import {
  parseKeyInfo,
  KeyInfo,
} from "./keyInfo";

export const Keyboard = ({ maxWidth=1024 }) => {
  const [pressedKey, setPressedKey] = useState({});

  const diagramRef = useRef(null)

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
  useEffect(() => {
    const connections = getKeyConnections()
    log.debug(diagramRef)
    diagramRef.current.setConnections(connections)
  }, [pressedKey]) // Passing pressedKey in this array means to call useEffect every time pressedKey changes state

  const parsedPressedKeyInfo = parseKeyInfo(pressedKey.info);

  const outerWrapperDivStyle = {
    maxWidth: maxWidth,
  }

  return (
    <>
      <div
        style={outerWrapperDivStyle}
        className="my-8 md:my-24 container mx-auto text-sm md:text-base p-4"
        id="keyblay-debug-outer-wrapper-div"
      >
        <div className="w-full h-full" id="keyblay-debug-content-wrapper-div">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-4/6 md:mr-8 md:px-4">
              <IntroText />
              <div className="flex flex-row">
                <div className="flex flex-row">
                  <KeyGrid cols="15" rows="10" keys={leftHandKeys} onClickEach={setPressedKey} />
                  <KeyGrid cols="6" rows="6" keys={leftThumbKeys} onClickEach={setPressedKey} gridAppendClasses="keyboard-left-thumb-cluster" />
                </div>
                <div className="flex flex-row-reverse">
                  <KeyGrid cols="15" rows="10" keys={rightHandKeys} onClickEach={setPressedKey} />
                  <KeyGrid cols="6" rows="6" keys={rightThumbKeys} onClickEach={setPressedKey} gridAppendClasses="keyboard-right-thumb-cluster" />
                </div>
              </div>
            </div>
            <div
              className={classnames(
                "w-full h-auto md:h-full right-0 left-0 md:left-auto md:w-4/12 md:mh-screen-90 md:t-20 fixed md:sticky",
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
          {/* We place the canvas last and therefore we do not need to specify a z-index -
            * it is naturally on top of the other content.
            */}
          <Diagram ref={diagramRef} />
        </div>
      </div>
    </>
  );
};
