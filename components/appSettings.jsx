import { useRouter } from "next/router";
import React, {
  useContext,
} from "react";

import classnames from "classnames";
import log from "loglevel";

import {
  AppDebugContext,
} from "~/components/appContext";
import {
  KeyMapState,
  LegendMapState,
} from "~/lib/appQueryState";
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";

export const AppSettings = ({ visible }) => {
  const [appDebug, setAppDebug] = useContext(AppDebugContext)
  const router = useRouter();

  return (
    <div
      className={classnames(
        // "bg-blue-200 shadow-lg m-4 p-4 rounded-md container m-auto",
        "container m-4 p-4",
        {
          "hidden": !visible,
        }
      )}
      id="keyblay-app-settings"
    >

      <hr />

      <div className="flex flex-wrap">
        <label htmlFor="keyblay-app-debug-selector" className="p-2 m-2 w-1/3">Debug level</label>
        <select
          onChange={event => setAppDebug({ debugLevel: parseInt(event.target.value) })}
          defaultValue={appDebug.debugLevel}
          name="Debug levels"
          id="keyblay-app-debug-selector"
          className="p-2 m-2 w-1/3"
        >
          <option value="0">Off</option>
          <option value="1">Extra logging</option>
          <option value="2">Yet more logging, visuals</option>
        </select>

        <label htmlFor="keyblay-legend-selector" className="p-2 m-2 w-1/3">Key legends</label>
        <select
          onChange={(event) => { LegendMapState.setQuery(router, event.target.value); }}
          defaultValue={LegendMapState.getValue(router)}
          name="Legend maps"
          id="keyblay-legend-selector"
          className="p-2 m-2 w-1/3"
        >
          {Object.keys(legendMaps).map((legendMapName, idx) => {
            return <option key={idx} value={legendMapName}>{legendMapName}</option>
          })}
        </select>

        <label htmlFor="keyblay-keymap-selector" className="p-2 m-2 w-1/3">Key layouts</label>
        <select
          // onChange={event => setKeyMap({ keyMapName: event.target.value })}
          onChange={(event) => { KeyMapState.setQuery(router, event.target.value); }}
          defaultValue={KeyMapState.getValue(router)}
          name="Layouts"
          id="keyblay-keymap-selector"
          className="p-2 m-2 w-1/3"
        >
          {Object.keys(keyMaps).map((keyMapName, idx) => {
            return <option key={idx} value={keyMapName}>{keyMapName}</option>
          })}
        </select>
      </div>

    </div >
  );
}
