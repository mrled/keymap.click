import React from "react";

import { SiteChrome } from "~/components/siteChrome";
import { useAppSettings } from "~/hooks/useAppSettings";
import { IntraAppLink } from "~/components/prose";

export default function Controls() {
  const {
    debugLevel,
    setDebugLevel,
    advancedMode,
    setAdvancedMode,
    dazzlingColor,
    setDazzlingColor,
  } = useAppSettings();
  return (
    <SiteChrome>
      <div className="w-full md:mr-8 md:px-4">
        <div className="border border-gray-300 bg-gray-100 rounded-md p-6 m-6">
          <h1 className="text-2xl pb-4">Control panel</h1>
          <p className="py-1">
            This is a secret.{" "}
            <IntraAppLink href="/">Return to safety</IntraAppLink>.
          </p>

          <div className="mt-4 table">
            <div className="table-row">
              <label
                htmlFor="app-debug-selector"
                className="p-2 m-2 text-xs table-cell"
              >
                Debug level
              </label>
              <select
                onChange={(event) =>
                  setDebugLevel(parseInt(event.target.value))
                }
                value={debugLevel}
                name="Debug levels"
                id="app-debug-selector"
                className="p-2 m-2 text-xs table-cell border"
              >
                <option value={0}>Off</option>
                <option value={1}>Extra logging</option>
                <option value={2}>Yet more logging, visuals</option>
              </select>
            </div>

            <div className="table-row">
              <label
                htmlFor="app-advanced-mode-selector"
                className="p-2 m-2 text-xs table-cell"
              >
                Show advanced mode
              </label>
              <input
                onChange={(/*event*/) => setAdvancedMode(!advancedMode)}
                checked={advancedMode}
                name="Show advanced mode"
                id="app-advanced-mode-selector"
                className="p-2 m-2 text-xs table-cell"
                type="checkbox"
              />
            </div>

            <div className="table-row">
              <label
                htmlFor="app-dazzling-color-selector"
                className="p-2 m-2 text-xs table-cell"
              >
                Enable dazzling color
              </label>
              <input
                onChange={() => setDazzlingColor(!dazzlingColor)}
                checked={dazzlingColor}
                name="Enable dazzling color"
                id="app-dazzling-color-selector"
                className="p-2 m-2 text-xs table-cell"
                type="checkbox"
              />
              <p className="p-2 m-2 text-xs table-cell">
                (Requires new page load)
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
