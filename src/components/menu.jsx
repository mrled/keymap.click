import React from "react";

import classnames from "classnames";

import { KeymapUiSettings } from "~/components/keymapUiSettings";
import { IntraAppLink } from "~/components/prose";
import { useAppSettings } from "~/hooks/useAppSettings";

export const Menu = ({ visible }) => {
  const { advancedMode } = useAppSettings();

  return (
    <div
      className={classnames(
        "container m-4 p-4",
        {
          "hidden": !visible,
        }
      )}
      id="app-menu"
    >

      <ul className="">
        <li><h2 className="mb-2 text-2xl">
          <IntraAppLink href="/about">What is this site?</IntraAppLink>
        </h2></li>
        <li><h2 className="mb-2 text-2xl">
          <IntraAppLink href="/ergodox">What kind of keyboard is this?</IntraAppLink>
        </h2></li>
        <li><h2 className="mb-2 text-2xl">
          <IntraAppLink href="/story">Personal history</IntraAppLink>
        </h2></li>
      </ul>

      {advancedMode ? <KeymapUiSettings /> : <></>}

    </div>
  );
}
