import React from "react";

import {
  KeyGrid,
  keyDataTextLabel,
  keyLegendAttrib,
} from "~/components/key";

/* A <KeyInfo> component styled nicely for the parent <Keyboard> component.
 * Include an entire <KeyGrid> just large enough to hold the largest key.
 */
export const KeyInfo = ({
  keyData,
  parsedKeyInfo,
  keyButtonOnClick = () => { },
}) => {
  let modifiedKeyData = Object.assign({}, keyData);
  modifiedKeyData.startPos = [0, 0];
  const keys = [modifiedKeyData]
  const textLabel = keyDataTextLabel(modifiedKeyData);
  const legendAttrib = keyLegendAttrib(modifiedKeyData);

  return (
    <>
      <div className="border-b pb-2 mb-2">
        <div className="flex justify-evenly">

          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-start">
              <div className="flex flex-col">
                <h2 className="text-sm md:text-2xl">Key information</h2>
                <button onClick={keyButtonOnClick} className="block text-blue-500">
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
        legendAttrib ? (
          <div className="text-2xs">
            <h2>Legend Attribution:</h2>
            <p>{keyLegendAttrib(modifiedKeyData)}</p>
          </div>
        ) : <></>
      }
    </>
  );
};
