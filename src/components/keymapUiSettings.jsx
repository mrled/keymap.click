import React, {
  useContext,
} from "react";

import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";
import {
  keyMaps,
  legendMaps,
} from "~/lib/keys";

export const KeymapUiSettings = () => {
  const { state, setLegendMap, setKeyMap } = useContext(KeymapUiStateContext);

  // If state is null, we will be on a page without a KeymapUiStateContext.Provider;
  // there are no settings to show, which means e.g. the legend/keymap dropdowns won't make sense.
  if (!state) {
    return <div />;
  } else {
    return (
      <div
        className="mt-4 md:m-0"
        id="app-settings"
      >
        <h2 className="mt-4 md:m-0">Settings</h2>

        <div className="table">

          <div className="table-row">
            <label htmlFor="legend-selector" className="table-cell text-sm">Key legends</label>
            <select
              onChange={(event) => { setLegendMap(event.target.value); }}
              defaultValue={state.legendMap}
              name="Legend maps"
              id="legend-selector"
              className="table-cell text-sm p-1 m-1"
            >
              {Object.keys(legendMaps).map((legendMapName, idx) => {
                return <option key={idx} value={legendMapName}>{legendMaps[legendMapName].fullName}</option>
              })}
            </select>
          </div>

          <div className="table-row">
            <label htmlFor="keymap-selector" className="table-cell text-sm">Key layouts</label>
            <select
              onChange={(event) => { setKeyMap(event.target.value); }}
              defaultValue={state.keyMap}
              name="Layouts"
              id="keymap-selector"
              className="table-cell text-sm p-1 m-1"
            >
              {Object.keys(keyMaps).map((keyMapName, idx) => {
                return <option key={idx} value={keyMapName}>{keyMaps[keyMapName].fullName}</option>
              })}
            </select>
          </div>

        </div>

      </div >
    );
  }
}
