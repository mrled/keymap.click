import Link from "next/link";
import React, {
  useContext,
} from "react";

import {
  VisibleMenuContext,
} from "~/components/appContext";
import {
  keyInfoConnectFromClass,
  keyInfoConnectFromClassPrefix,
} from "~/lib/keyConnections";

/* A wrapper for the NextJS <Link> component
 *
 * Close the menu, if visible, when linking between pages.
 */
export const IntraAppLink = ({ href, children }) => {
  const [visibleMenu, setVisibleMenu] = useContext(VisibleMenuContext);
  return (
    <Link href={href}>
      <a className="text-blue-600" onClick={() => setVisibleMenu(false)}>
        {children}
      </a>
    </Link>
  )
}

/* An external link
 */
export const ExternalLink = ({ href, children }) => {
  return (
    <a className="text-blue-600" href={href}>
      {children}
    </a>
  );
}

/* A prose paragraph
 */
export const Para = ({ children }) => {
  return <p className="my-4">{children}</p>;
}

/* A key indicator
 */
export const Indicator = ({ children, id }) => {
  return (
    <span
      className={`${keyInfoConnectFromClass} ${keyInfoConnectFromClassPrefix}${id} bg-green-200 truncate`}
    >
      {children}
    </span>
  );
}

