import React, {
  useContext,
} from "react";

import {
  KeyGrid,
  Legend,
} from "~/components/key";
import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";

/* A <KeyInfo> component styled nicely for the parent <Keyboard> component.
 * Include an entire <KeyGrid> just large enough to hold the largest key.
 */
export const KeyInfo = ({ keyData, parsedKeyInfo }) => {
  let modifiedKeyData = Object.assign({}, keyData);
  modifiedKeyData.startPos = [0, 0];
  const keys = [modifiedKeyData];

  const { hydratedState, setKeyId } = useContext(KeymapUiStateContext);
  const legend = Legend(hydratedState.legendMap[keyData.legend]);

  const textLabel = modifiedKeyData.name || legend.legend;

  return (
    <>
      <div className="border-b pb-2 mb-2">
        <div className="flex justify-evenly">

          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-start">
              <div className="flex flex-col">
                <h2 className="text-sm md:text-2xl">Key information</h2>
                <button onClick={setKeyId} className="block text-blue-500">
                  deselect key
              </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-center">
              <KeyGrid
                cols={keyData.size ? keyData.size[0] : 2} // HACK: we rely on a default with of 2 here
                rows="4"
                keys={keys}
                legends={hydratedState.legendMap}
                pressedKey={keyData}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-end">
              <span className="p-5 font-mono">{textLabel}</span>
            </div>
          </div>

        </div>
      </div>
      <div className="py-5">
        <p className="">{parsedKeyInfo}</p>
      </div>
      {
        legend.attrib ? (
          <div className="text-2xs">
            <h2>Legend Attribution:</h2>
            <p>{legend.attrib}</p>
          </div>
        ) : <></>
      }
    </>
  );
};
