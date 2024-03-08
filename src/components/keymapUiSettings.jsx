import React, { useContext } from "react";

import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";
import { keyMaps, legendMaps } from "~/lib/keys";

export const KeymapUiSettings = () => {
  const { state, setLegendMap, setKeyMap } = useContext(KeymapUiStateContext);

  // If state is null, we will be on a page without a KeymapUiStateContext.Provider;
  // there are no settings to show, which means e.g. the legend/keymap dropdowns won't make sense.
  if (!state) {
    return <div />;
  } else {
    return (
      <div id="app-settings">
        <h2>Settings</h2>

        <div className="controls-table-layout">
          <div>
            <label htmlFor="legend-selector">Key legends</label>
            <select
              onChange={(event) => {
                setLegendMap(event.target.value);
              }}
              defaultValue={state.legendMap}
              name="Legend maps"
              id="legend-selector"
            >
              {Object.keys(legendMaps).map((legendMapName, idx) => {
                return (
                  <option key={idx} value={legendMapName}>
                    {legendMaps[legendMapName].fullName}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="keymap-selector">Key layouts</label>
            <select
              onChange={(event) => {
                setKeyMap(event.target.value);
              }}
              defaultValue={state.keyMap}
              name="Layouts"
              id="keymap-selector"
            >
              {Object.keys(keyMaps).map((keyMapName, idx) => {
                return (
                  <option key={idx} value={keyMapName}>
                    {keyMaps[keyMapName].fullName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }
};
