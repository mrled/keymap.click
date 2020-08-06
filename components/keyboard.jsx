import { useRouter } from "next/router";
import React, {
  useEffect,
  useState,
} from "react";

import log from "loglevel";

import { KeyGrid } from "~/components/key";
import { useKeyConnections } from "~/lib/keyConnections";
import {
  allKeysById,
  leftHandKeys,
  leftThumbKeys,
  rightHandKeys,
  rightThumbKeys,
} from "~/lib/keys";

export const Keyboard = ({ pressedKey, setPressedKey }) => {
  const [otherSelectedKeys, setOtherSelectedKeys] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const keyId = router.query.keyId;
    if (keyId && allKeysById[keyId]) {
      setPressedKey(allKeysById[keyId]);
      log.debug(`On load using selected key id: ${keyId}`);
    } else {
      log.debug(`On load no such key id: ${keyId}`);
    }
  }, [router.query.keyId, setPressedKey]);

  const setPressedAndSelectedKeys = (keyData) => {
    setPressedKey(keyData);
    setOtherSelectedKeys(keyData.selection);
    if (keyData) {
      router.push(`/?keyId=${keyData.id}`);
    } else {
      router.push("/");
    }
  };

  const { connections, targetKeyIds } = useKeyConnections(pressedKey);

  return (
    <div className="flex items-center justify-center flex-col md:flex-row mt-0">
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

      <div className="flex flex-col mt-0">
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
  )
}
