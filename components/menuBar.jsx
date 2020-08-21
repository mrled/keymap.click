import React, {
  useContext,
} from "react";

import {
  VisibleMenuContext,
} from "~/components/appContext";
import { Menu } from "~/components/menu";
import { InterAppLink } from "~/components/interAppLink";

export const MenuBar = ({ showSettings = false }) => {
  const [visibleMenu, setVisibleMenu] = useContext(VisibleMenuContext);

  return (
    <div
      className="border border-gray-300 bg-gray-100 rounded-md p-2 m-8"
      id="keyblay-ui-app-bar-container"
    >

      <div className="flex flex-row justify-between">

        <h1
          className="text-xl flex-col p-2 keyblay-font-roboto-mono"
        >
          <InterAppLink href="/">keymap.click</InterAppLink>
        </h1>

        <button
          className="inline text-blue-500 p-2"
          onClick={() => { setVisibleMenu(s => !s) }}>
          {visibleMenu ? "Hide menu" : "Show menu"}
        </button>

      </div>

      <div className="flex flex-row">
        <Menu visible={visibleMenu} showSettings={showSettings} />
      </div>

    </div>
  );

}