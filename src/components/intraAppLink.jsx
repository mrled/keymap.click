import Link from "next/link";
import React, {
  useContext,
} from "react";

import {
  VisibleMenuContext,
} from "~/components/appContext";

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
