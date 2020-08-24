import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { InterAppLink } from "~/components/interAppLink";
import { parseKeyInfo, KeyInfo } from "~/components/keyInfo";
import {
  GuideState,
  GuideStepState,
  KeyMapState,
} from "~/lib/appQueryState";

/* Return a KeyInfoInner component, wrapped in a <KeyInfo> component
 * styled nicely for the parent <Keyboard> component
 */
export const InfoPanel = ({ keyData, keyButtonOnClick = () => { } }) => {
  const router = useRouter();

  const currentGuideName = GuideState.getValue(router);
  const currentGuideStep = GuideStepState.getValue(router);
  const currentKeyMapName = KeyMapState.getValue(router);

  const inGuide = Boolean(currentGuideName) && currentGuideStep !== null;
  const keySelected = Boolean(keyData.info);

  if (keySelected) {
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

