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
  } = useAppSettings();
  return (
    <SiteChrome>
      <div className="control-panel">
        <h1>Control panel</h1>
        <p>
          This is a secret.{" "}
          <IntraAppLink href="/">Return to safety</IntraAppLink>.
        </p>

        <div className="control-table">
          <div>
            <label htmlFor="app-debug-selector">Debug level</label>
            <select
              onChange={(event) => setDebugLevel(parseInt(event.target.value))}
              value={debugLevel}
              name="Debug levels"
              id="app-debug-selector"
            >
              <option value={0}>Off</option>
              <option value={1}>Extra logging</option>
              <option value={2}>Yet more logging, visuals</option>
            </select>
          </div>

          <div>
            <label htmlFor="app-advanced-mode-selector">
              Show advanced mode
            </label>
            <input
              onChange={(/*event*/) => setAdvancedMode(!advancedMode)}
              checked={advancedMode}
              name="Show advanced mode"
              id="app-advanced-mode-selector"
              type="checkbox"
            />
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
