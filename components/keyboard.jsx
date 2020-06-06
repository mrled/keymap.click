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
  Key,
  KeyGrid,
} from "./key";
import {
  parseKeyInfo,
  KeyInfo,
} from "./keyInfo";
import {
  ConnectorCanvas,
  Point,
} from "./diagram";

/* A simple component containing the introduction text
 */
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
          className="text-blue-600 undere"
          href="https://github.com/mrled/keyblay"
        >
          https://github.com/mrled/keyblay
        </a>
      </p>
    </div>
  );
};


/* Return a list of connections that need to be drawn as lines on the diagram.
 * Scan the whole DOM for every pointer to a keyboard key.
 *   Assumes that each pointer has at least two CSS classes set -
 *   A class literally called 'key-info-connect-from', to identify it as a pointer, and
 *   a class called key-info-connect-from-{target id}, to contain the target of the pointer.
 *   For example, key-info-connet-from-l-f-1-1 points to the key identified by l-f-1-1,
 *   which is in the _l_eft half, _f_inger cluster, column 1, row 1.
 *   A key pointer can point to more than one key.
 * Returns a list of connections.
 * Each connection is a list containing a pair of [source, target] coordinates.
 *   The target must be identified with a CSS id of the key id -
 *   for our above example, that would require a key on the board with a CSS id of l-f-1-1.
 * Each coordinate is a DOMRect.
 */
const getKeyConnections = () => {
  // TODO: can I put magic strings like this in a central place somewhere?
  const kicfClass = 'key-info-connect-from'
  const kicfPrefix = 'key-info-connect-from-'

  // A list of all the key pointers in the DOM
  const renderedKeyPointers = document.getElementsByClassName(kicfClass)

  var connections = []
  for (let keyPointer of renderedKeyPointers) {
    const sourceCoords = keyPointer.getBoundingClientRect()

    // Convert the key pointer class names to a list of bare key pointers,
    // e.g. key-info-connect-from-l-f-1-1 => l-f-1-1
    const targetKeyIds = keyPointer
      .className
      .split(' ')
      .filter(cls => cls.startsWith(kicfPrefix))
      .map(cls => cls.slice(kicfPrefix.length))

    targetKeyIds.forEach(targetKeyId => {
      const targetKey = document.getElementById(targetKeyId)
      const targetCoords = targetKey.getBoundingClientRect()
      log.debug(`Draw on the canvas from source at ${sourceCoords.x}, ${sourceCoords.y} to dest key with ID ${targetKeyId} at ${targetCoords.x},${targetCoords.y}`)
      connections.push([sourceCoords, targetCoords])
    })
  }
  return connections;
}

export const Keyboard = ({ maxWidth=1024 }) => {
  const [pressedKey, setPressedKey] = useState({});

  const connectorCanvasRef = useRef(null)

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

  /* When pressedKey changes, update the diagram
   */
  useEffect(() => {
    const connections = getKeyConnections()
    log.debug(connectorCanvasRef)
    connectorCanvasRef.current.setConnections(connections)
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
              <div className="flex flex-row debug-bg-teal-disabled">
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
              <ConnectorCanvas ref={connectorCanvasRef} />
          </div>

        </div>
      </div>
    </>
  );
};
