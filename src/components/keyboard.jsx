import React, {
  useContext,
} from "react";

import { KeyGrid } from "~/components/key";
import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";

export const Keyboard = ({ targetKeyIds }) => {
  const { hydratedState, setKeyId } = useContext(KeymapUiStateContext);

  return (
    <div className="flex items-center justify-center flex-col md:flex-row mt-0">
      <div className="flex flex-col">
        <h2 className="text-xl">Left hand</h2>
        <div className="flex flex-row">
          <KeyGrid
            cols="15"
            rows="10"
            keys={hydratedState.keyMap.leftHandKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
          />
          <KeyGrid
            cols="6"
            rows="6"
            keys={hydratedState.keyMap.leftThumbKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
            gridAppendClasses="keyboard-left-thumb-cluster"
          />
        </div>
      </div>

      <div className="flex flex-col mt-0">
        <h2 className="text-xl ml-auto">Right hand</h2>
        <div className="flex flex-row-reverse">
          <KeyGrid
            cols="15"
            rows="10"
            keys={hydratedState.keyMap.rightHandKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
          />
          <KeyGrid
            cols="6"
            rows="6"
            keys={hydratedState.keyMap.rightThumbKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
            gridAppendClasses="keyboard-right-thumb-cluster"
          />
        </div>
      </div>
    </div>
  )
}
