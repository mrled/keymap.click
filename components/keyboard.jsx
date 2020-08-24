import { useRouter } from "next/router";
import React, {
  useEffect,
  useState,
} from "react";

import log from "loglevel";

import { KeyGrid } from "~/components/key";
import {
  KeyMapState,
  SelectedKeyState,
} from "~/lib/appQueryState";
import {
  keyMaps,
} from "~/lib/keys";

export const Keyboard = ({ guideStep, otherSelectedKeys, pressedKey, targetKeyIds, setOtherSelectedKeys, setPressedKey }) => {
  const router = useRouter();

  const keyMapName = KeyMapState.getValue(router);
  const keyMap = keyMaps[keyMapName];

  useEffect(() => {
    const keyId = router.query.keyId;
    if (keyId && keyMap.allKeysById[keyId]) {
      setPressedKey(keyMap.allKeysById[keyId]);
      log.debug(`On load using selected key id: ${keyId}`);
    } else {
      log.debug(`On load no such key id: ${keyId}`);
    }
  }, [keyMap, router.query.keyId, setPressedKey]);

  const setPressedAndSelectedKeys = (keyData) => {
    setPressedKey(keyData);
    setOtherSelectedKeys(keyData.selection);
    SelectedKeyState.setQuery(router, keyData ? keyData.id : null);
  };

  return (
    <div className="flex items-center justify-center flex-col md:flex-row mt-0">
      <div className="flex flex-col">
        <h2 className="text-xl">Left hand</h2>
        <div className="flex flex-row">
          <KeyGrid
            cols="15"
            rows="10"
            keys={keyMap.leftHandKeys}
            pressedKey={pressedKey}
            selectedKeys={otherSelectedKeys}
            targetKeyIds={targetKeyIds}
            onClickEach={setPressedAndSelectedKeys}
          />
          <KeyGrid
            cols="6"
            rows="6"
            keys={keyMap.leftThumbKeys}
            pressedKey={pressedKey}
            selectedKeys={otherSelectedKeys}
            targetKeyIds={targetKeyIds}
            onClickEach={setPressedAndSelectedKeys}
            gridAppendClasses="keyboard-left-thumb-cluster"
          />
        </div>
      </div>

      <div className="flex flex-col mt-0">
        <h2 className="text-xl ml-auto">Right hand</h2>
        <div className="flex flex-row-reverse">
          <KeyGrid
            cols="15"
            rows="10"
            keys={keyMap.rightHandKeys}
            pressedKey={pressedKey}
            selectedKeys={otherSelectedKeys}
            targetKeyIds={targetKeyIds}
            onClickEach={setPressedAndSelectedKeys}
          />
          <KeyGrid
            cols="6"
            rows="6"
            keys={keyMap.rightThumbKeys}
            pressedKey={pressedKey}
            selectedKeys={otherSelectedKeys}
            targetKeyIds={targetKeyIds}
            onClickEach={setPressedAndSelectedKeys}
            gridAppendClasses="keyboard-right-thumb-cluster"
          />
        </div>
      </div>
    </div>
  )
}
