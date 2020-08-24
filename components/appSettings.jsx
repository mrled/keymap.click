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

export const AppSettings = () => {
  const [appDebug, setAppDebug] = useContext(AppDebugContext)
  const router = useRouter();

  return (
    <div
      className="mt-4"
      id="app-settings"
    >

      <hr />

      <h2 className="mt-4 mb-4 text-2xl">Settings</h2>

      <div className="flex flex-wrap">
        <label htmlFor="app-debug-selector" className="p-2 m-2 w-1/3">Debug level</label>
        <select
          onChange={event => setAppDebug({ debugLevel: parseInt(event.target.value) })}
          defaultValue={appDebug.debugLevel}
          name="Debug levels"
          id="app-debug-selector"
          className="p-2 m-2 w-1/3"
        >
          <option value="0">Off</option>
          <option value="1">Extra logging</option>
          <option value="2">Yet more logging, visuals</option>
        </select>

        <label htmlFor="legend-selector" className="p-2 m-2 w-1/3">Key legends</label>
        <select
          onChange={(event) => { LegendMapState.setQuery(router, event.target.value); }}
          defaultValue={LegendMapState.getValue(router)}
          name="Legend maps"
          id="legend-selector"
          className="p-2 m-2 w-1/3"
        >
          {Object.keys(legendMaps).map((legendMapName, idx) => {
            return <option key={idx} value={legendMapName}>{legendMaps[legendMapName].fullName}</option>
          })}
        </select>

        <label htmlFor="keymap-selector" className="p-2 m-2 w-1/3">Key layouts</label>
        <select
          onChange={(event) => { KeyMapState.setQuery(router, event.target.value); }}
          defaultValue={KeyMapState.getValue(router)}
          name="Layouts"
          id="keymap-selector"
          className="p-2 m-2 w-1/3"
        >
          {Object.keys(keyMaps).map((keyMapName, idx) => {
            return <option key={idx} value={keyMapName}>{keyMaps[keyMapName].fullName}</option>
          })}
        </select>
      </div>

    </div >
  );
}
