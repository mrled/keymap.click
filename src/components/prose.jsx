import React from "react";

import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/keyConnections";

/* A key indicator
 */
export const Indicator = ({ children, id, kbd = false }) => {
  const innerSpan = kbd ? <kbd>{children}</kbd> : children;
  const connectToId = `${keyInfoConnectFromClassPrefix}${id}`;
  const classes = `key-indicator ${keyInfoConnectFromClass} ${connectToId}`;
  return <span className={classes}>{innerSpan}</span>;
};
