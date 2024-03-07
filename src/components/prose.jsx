import React from "react";

import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/keyConnections";

/* A key indicator
 */
export const Indicator = ({ children, id, kbd = false }) => {
  const innerSpan = kbd ? <kbd>{children}</kbd> : children;
  return (
    <span
      className={`${keyInfoConnectFromClass} ${keyInfoConnectFromClassPrefix}${id} bg-green-200 truncate`}
    >
      {innerSpan}
    </span>
  );
};
