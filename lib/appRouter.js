import { useRouter } from "next/router";
import {
  useContext,
} from "react";

import log from "loglevel";

import {
  KeyMapContext,
  LegendMapContext,
  PressedKeyContext,
} from "~/components/appContext";
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";

export const updateRoute = ({ router, selectedKeyData = null, selectedKeyMap = null, selectedLegendMap = null }) => {
  let newRouteQuery = [];

  if (selectedKeyData) {
    newRouteQuery.push(`keyId=${selectedKeyData.id}`);
  } else if (router.query.keyId) {
    newRouteQuery.push(`keyId=${router.query.keyId}`);
  }

  if (selectedKeyMap) {
    newRouteQuery.push(`keyMap=${selectedKeyMap}`);
  } else if (router.query.keyId) {
    newRouteQuery.push(`keyMap=${router.query.keyMap}`);
  }

  if (selectedLegendMap) {
    newRouteQuery.push(`legendMap=${selectedLegendMap}`);
  } else if (router.query.keyId) {
    newRouteQuery.push(`legendMap=${router.query.legendMap}`);
  }

  const queryString = newRouteQuery ? `?${newRouteQuery.join("&")}` : "";
  router.push(`/${queryString}`);
}

/*

export const extractRouteParams = () => {
  // export const useAppRoute = () => {
  // export const updateAppFromRoute = () => {

  // const [keyMap, setKeyMap] = useContext(KeyMapContext);
  // const [legendMap, setLegendMap] = useContext(LegendMapContext);
  // const [pressedKey, setPressedKey] = useContext(PressedKeyContext);
  const router = useRouter();

  const keyMapObj = keyMaps[keyMap];

  const qKeyId = router.query.keyId;
  const qLegendMap = router.query.legendMap;
  const qKeyMap = router.query.keyMap;


  // if (qKeyId && keyMapObj.allKeysById[qKeyId]) {
  //   setPressedKey(keyMapObj.allKeysById[qKeyId]);
  //   log.debug(`On load using selected key id: ${qKeyId}`);
  // } else {
  //   log.debug(`On load no such key id: ${qKeyId}`);
  // }

  // if (qLegendMap && legendMaps[qLegendMap]) {
  //   setLegendMap(qLegendMap);
  //   log.debug(`On load using selected legend map: ${qLegendMap}`);
  // } else {
  //   log.debug(`On load no such legend map: ${qLegendMap}`)
  // }

  // if (qKeyMap && keyMaps[qKeyMap]) {
  //   setKeyMap(qKeyMap);
  //   log.debug(`On load using selected key map: ${qKeyMap}`);
  // } else {
  //   log.debug(`On load no such key map: ${qKeyMap}`)
  // }

}

*/