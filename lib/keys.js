import MrlLegends from "./keyLegends/mrlLegends";

import MrlMainLayer from "./keyMaps/mrlMainLayer";

export const keyMaps = {
  MrlMainLayer: MrlMainLayer,
}

Object.keys(keyMaps).forEach((keyMapName) => {
  const keyMap = keyMaps[keyMapName]
  keyMap.allKeys = [].concat(keyMap.leftHandKeys, keyMap.leftThumbKeys, keyMap.rightHandKeys, keyMap.rightThumbKeys);
  keyMap.allKeysById = {};
  keyMap.allKeys.forEach((keyData) => {
    const side = keyData.board[0] == "right" ? "r" : "l";
    const cluster = keyData.board[1] == "finger" ? "f" : "t";
    const keyId = `${side}-${cluster}-${keyData.startPos[0]}-${keyData.startPos[1]}`;
    keyData.reactKey = keyId;
    keyData.id = keyId;
    keyMap.allKeysById[keyData.id] = keyData;
  });
})

export const legendMaps = {
  MrlLegends: MrlLegends,
}
