import { useRouter } from "next/router";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import log from "loglevel";

import {
  KeyMapContext,
  LegendMapContext,
  PressedKeyContext
} from "./appContext";
import { KeyGrid } from "~/components/key";
import {
  // useAppRoute,
  updateRoute,
} from "~/lib/appRouter";
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";

export const Keyboard = ({ targetKeyIds }) => {
  const [otherSelectedKeys, setOtherSelectedKeys] = useState([]);
  const [keyMap, setKeyMap] = useContext(KeyMapContext)
  const [legendMap, setLegendMap] = useContext(LegendMapContext)
  const [pressedKey, setPressedKey] = useContext(PressedKeyContext)

  const router = useRouter();

  const keyMapObj = keyMaps[keyMap.keyMapName];
  // const legend = legends[legendName]

  // useEffect(() => {
  //   updateRoute();
  // }, [router.query]);

  // useEffect(() => {
  //   updateRoute({
  //     selectedKeyData: keyMapObj.allKeysById[pressedKey.pressedKeyData],
  //     selectedKeyMap: keyMap.keyMapName,
  //     selectedLegendMap: legendMap.legendMapName,
  //   })
  // }, [keyMap, keyMapObj, legendMap, pressedKey]);

  // useEffect(() => {
  //   const qKeyId = router.query.keyId;
  //   const qLegendMap = router.query.legendMap;
  //   const qKeyMap = router.query.keyMap;

  //   if (qKeyId && keyMapObj.allKeysById[qKeyId]) {
  //     setPressedKey(keyMapObj.allKeysById[qKeyId]);
  //     log.debug(`On load using selected key id: ${qKeyId}`);
  //   } else {
  //     log.debug(`On load no such key id: ${qKeyId}`);
  //   }

  //   if (qLegendMap && legendMaps[qLegendMap]) {
  //     setLegendMap(qLegendMap);
  //     log.debug(`On load using selected legend map: ${qLegendMap}`);
  //   } else {
  //     log.debug(`On load no such legend map: ${qLegendMap}`)
  //   }

  //   if (qKeyMap && keyMaps[qKeyMap]) {
  //     setKeyMap(qKeyMap);
  //     log.debug(`On load using selected key map: ${qKeyMap}`);
  //   } else {
  //     log.debug(`On load no such key map: ${qKeyMap}`)
  //   }

  // }, [router.query]);

  const setPressedAndSelectedKeys = (keyData) => {
    setPressedKey(keyData);
    setOtherSelectedKeys(keyData.selection);
    updateRoute({ router: router, selectedKeyData: keyData });
    // if (keyData) {
    //   router.push(`/?keyId=${keyData.id}`);
    // } else {
    //   router.push("/");
    // }
  };

  return (
    <div className="flex items-center justify-center flex-col md:flex-row mt-0">
      <div className="flex flex-col">
        <h2 className="text-xl">Left hand</h2>
        <div className="flex flex-row">
          <KeyGrid
            cols="15"
            rows="10"
            keys={keyMapObj.leftHandKeys}
            pressedKey={pressedKey}
            selectedKeys={otherSelectedKeys}
            targetKeyIds={targetKeyIds}
            onClickEach={setPressedAndSelectedKeys}
          />
          <KeyGrid
            cols="6"
            rows="6"
            keys={keyMapObj.leftThumbKeys}
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
            keys={keyMapObj.rightHandKeys}
            pressedKey={pressedKey}
            selectedKeys={otherSelectedKeys}
            targetKeyIds={targetKeyIds}
            onClickEach={setPressedAndSelectedKeys}
          />
          <KeyGrid
            cols="6"
            rows="6"
            keys={keyMapObj.rightThumbKeys}
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
