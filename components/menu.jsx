import React from "react";

import classnames from "classnames";

import { AppSettings } from "~/components/appSettings";
import { InterAppLink } from "~/components/interAppLink";

export const Menu = ({ visible, showSettings = false }) => {

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
          <InterAppLink href="/about">What is this site?</InterAppLink>
        </h2></li>
        <li><h2 className="mb-2 text-2xl">
          <InterAppLink href="/ergodox">What kind of keyboard is this?</InterAppLink>
        </h2></li>
        <li><h2 className="mb-2 text-2xl">
          <InterAppLink href="/story">Personal history</InterAppLink>
        </h2></li>
      </ul>

      <div className={showSettings ? "visible" : "hidden"}>
        <AppSettings />
      </div>

    </div>
  );
}
