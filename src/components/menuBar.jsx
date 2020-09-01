import React, {
  useContext,
} from "react";

import {
  VisibleMenuContext,
} from "~/components/appContext";
import { Menu } from "~/components/menu";
import { IntraAppLink } from "~/components/prose";

export const MenuBar = () => {
  const [visibleMenu, setVisibleMenu] = useContext(VisibleMenuContext);

  return (
    <div
      className="border border-gray-300 bg-gray-100 rounded-md p-2 m-8"
      id="menu-bar-container"
    >

      <div className="flex flex-row justify-between">

        <h1
          className="text-xl flex-col p-2 font-roboto-mono"
        >
          <IntraAppLink href="/">keymap.click</IntraAppLink>
        </h1>

        <button
          className="inline text-blue-500 p-2"
          onClick={() => { setVisibleMenu(s => !s) }}>
          {visibleMenu ? "Hide menu" : "Show menu"}
        </button>

      </div>

      <div className="flex flex-row">
        <Menu visible={visibleMenu} />
      </div>

    </div>
  );

}