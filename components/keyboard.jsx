import { useState, useRef, useEffect } from "react";
import classnames from "classnames";

import {
  leftHandKeys,
  leftThumbKeys,
  rightHandKeys,
  rightThumbKeys,
} from "../lib/keys";
import { Key } from "./key";
import { KeyInfo } from "./keyInfo";

export const Keyboard = () => {
  const [pressedKey, setPressedKey] = useState({});

  const allKeys = leftHandKeys
    .slice(0)
    .concat(leftThumbKeys, rightHandKeys, rightThumbKeys);
  allKeys.forEach((keyData, idx) => {
    keyData.idx = idx;
  });

  const handleKeyDown = (e) => {
    e.keyCode === 9 && e.preventDefault();
    const found = allKeys.find((key) => key.keyCode === e.keyCode);
    if (!found) return;
    setPressedKey(found);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const infoText = () => {
    return (
      <>
        <div className="flex flex-row justify-between items-center border-b md:border-none pb-2 mb-2 md:mb-none">
          <h2 className="text-2xl">Key information</h2>
          <button
            onClick={() => setPressedKey({})}
            className="block md:hidden text-blue-500"
          >
            close
          </button>
        </div>
          {pressedKey.info ? (
            <KeyInfo keyData={pressedKey} />
          ) : (
            "Select a key"
          )}
      </>
    );
  };

  const introTextDiv = () => {
    return (
      <>
        <div className="pb-20">
          <h1 className="text-3xl border-b pb-8 mb-8">
            keyblay: Experiments in keyboard layouts
          </h1>
          <p className="p-1">This is a work in progress.</p>
          <p className="p-1">
            I am building this to show off keyboard layouts for my ErgoDox, and
            provide explanations for why I made the layout decisions I made. The
            ErgoDox-EZ has been a huge part of my strategy for dealing with RSI,
            and I want to be able to visually explain to others how it helped
            me.
          </p>
          <p className="p-1">
            I am building it on GitHub. Issues and contributions welcome.{" "}
            <a
              className="text-blue-600 underline"
              href="https://github.com/mrled/keyblay"
            >
              https://github.com/mrled/keyblay
            </a>
          </p>
        </div>
      </>
    );
  };

  const boardGrid = (cols, rows, keys, appendClasses="") => {
    return (
      <>
        <div
          className={classnames(
            `grid grid-cols-${cols}-keyb grid-rows-${rows}-keyb`,
            appendClasses,
          )}
        >
          {keys.map((keyData) => {
            return (
              <Key keyData={keyData} onClick={() => setPressedKey(keyData)} />
            );
          })}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-4/6 md:mr-8 md:px-4">
          {introTextDiv()}
          <div className="flex flex-row">
            {boardGrid(15, 10, leftHandKeys)}
            {boardGrid(6, 6, leftThumbKeys, "keyboard-left-thumb-cluster")}
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <div className="flex flex-row-reverse">
            {boardGrid(15, 10, rightHandKeys, "")}
            {boardGrid(6, 6, rightThumbKeys, "keyboard-right-thumb-cluster")}
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
            {infoText()}
          </div>
        </div>
      </div>
    </>
  );
};
