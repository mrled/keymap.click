import { useEffect, useRef } from "react";

import { useAppSettings } from "./useAppSettings";

/* Log which props changed to cause a component to render.
 *
 * <https://usehooks.com/useWhyDidYouUpdate/>
 */

export function useWhyDidYouUpdate(name, props) {
  // Mutable ref to store props for comparison next time this hook runs.
  const previousProps = useRef();

  const { debugLevel } = useAppSettings();

  useEffect(() => {
    if (debugLevel === 0) {
      return;
    }

    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};
      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    } else {
      console.log("[why-did-you-update] (initial render)", name, props);
    }

    previousProps.current = props;
  });
}
