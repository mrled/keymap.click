import Link from "next/link";
import React from "react";

import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/keyConnections";

/* A wrapper for the NextJS <Link> component
 *
 * Close the menu, if visible, when linking between pages.
 */
export const IntraAppLink = ({ href, children }) => {
  return (
    <Link href={href} className="text-blue-600">
      {children}
    </Link>
  );
};

/* An external link
 */
export const ExternalLink = ({ href, children }) => {
  return (
    <a className="text-blue-600" href={href}>
      {children}
    </a>
  );
};

/* A prose paragraph
 */
export const Para = ({ children }) => {
  return <p>{children}</p>;
};

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
