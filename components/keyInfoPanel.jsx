import React from "react";

import { InterAppLink } from "~/components/interAppLink";
import {
  KeyInfo
} from "~/components/keyInfo";
import {
  parseKeyInfo,
} from "~/lib/keyInfoParser";

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
    return (
      <div>
        <h1 className="text-2xl pb-4">
          Welcome
      </h1>
        <p className="p-1">Please select a key.</p>
        <p className="p-1">
          <InterAppLink href="/about">What is this?</InterAppLink>
        </p>
      </div>
    );
  }
};

