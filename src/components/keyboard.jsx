import React, { useContext } from "react";

import { KeymapUiStateContext } from "~/hooks/useKeymapUiState";
import { useWhyDidYouUpdate } from "~/hooks/useWhyDidYouUpdate";
import { WCKeyGrid } from "~/webcomponents/reactWrapper";

export const Keyboard = (props) => {
  const { targetKeyIds } = props;
  useWhyDidYouUpdate("Keyboard", props);
  const { hydratedState, setKeyId } = useContext(KeymapUiStateContext);

  return (
    <div className="keyboard">
      <div className="keyboard-sub-board keyboard-sub-board-left">
        <h2>Left hand</h2>
        <div className="keygrid-container">
          <WCKeyGrid
            gridName="left finger"
            cols="15"
            rows="10"
            keys={hydratedState.keyMap.leftHandKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
            keySelection={hydratedState.keySelection}
          />
          <WCKeyGrid
            gridName="left thumb"
            cols="6"
            rows="6"
            keys={hydratedState.keyMap.leftThumbKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
            gridAppendClasses="keyboard-left-thumb-cluster"
            keySelection={hydratedState.keySelection}
          />
        </div>
      </div>

      <div className="keyboard-sub-board keyboard-sub-board-right">
        <h2>Right hand</h2>
        <div className="keygrid-container">
          <WCKeyGrid
            gridName="right finger"
            cols="15"
            rows="10"
            keys={hydratedState.keyMap.rightHandKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
            keySelection={hydratedState.keySelection}
          />
          <WCKeyGrid
            gridName="right thumb"
            cols="6"
            rows="6"
            keys={hydratedState.keyMap.rightThumbKeys}
            legends={hydratedState.legendMap}
            pressedKey={hydratedState.keyData}
            targetKeyIds={targetKeyIds}
            onClickEach={setKeyId}
            gridAppendClasses="keyboard-right-thumb-cluster"
            keySelection={hydratedState.keySelection}
          />
        </div>
      </div>
    </div>
  );
};
