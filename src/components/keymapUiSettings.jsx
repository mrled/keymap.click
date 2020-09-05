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
        className="mt-4"
        id="app-settings"
      >

        <hr />

        <h2 className="mt-4 mb-4 text-2xl">Settings</h2>

        <div className="flex flex-wrap">
          <label htmlFor="legend-selector" className="p-2 m-2 w-1/3">Key legends</label>
          <select
            onChange={(event) => { setLegendMap(event.target.value); }}
            defaultValue={state.legendMap}
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
            onChange={(event) => { setKeyMap(event.target.value); }}
            defaultValue={state.keyMap}
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
}
