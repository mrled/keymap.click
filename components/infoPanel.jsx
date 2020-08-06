import React from "react";

import { IntroText } from "~/components/introText";
import { parseKeyInfo, KeyInfo } from "~/components/keyInfo";

/* Return a KeyInfoInner component, wrapped in a <KeyInfo> component
 * styled nicely for the parent <Keyboard> component
 */
export const InfoPanel = ({ keyData, keyButtonOnClick = () => { } }) => {
  if (keyData.info) {
    const parsedKeyInfo = parseKeyInfo(keyData.info);
    return (
      <KeyInfo
        keyData={keyData}
        parsedKeyInfo={parsedKeyInfo}
        keyButtonOnClick={keyButtonOnClick}
      />
    );
  } else {
    return <IntroText />;
  }
};
