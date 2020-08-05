import {
  useContext,
  useState,
} from "react";
import { useRouter } from "next/router";

import { Diagram } from "./diagram";
import { InfoPanel } from "./infoPanel";

import { AppDebugContext } from "~/components/appDebugContext";
import { Keyboard } from "~/components/keyboard";
import { VisualDebugStyle } from "~/components/visualDebugStyle";
import { useWindowSize } from "../lib/hooks";
import { useKeyConnections } from "../lib/keyConnections";

export const KeyblayUI = () => {
  const [pressedKey, setPressedKey] = useState({});
  const [appDebug, setAppDebug] = useContext(AppDebugContext)
  const windowSize = useWindowSize();
  const router = useRouter();

  const { connections, targetKeyIds } = useKeyConnections([
    pressedKey,
    windowSize,
  ]);

  return (
    <>

      <VisualDebugStyle enableDebug={appDebug.debugLevel > 1} />

      <div
        className="w-full h-full text-sm md:text-base p-4 flex max-w-screen-lg debug-bg-yellow"
        id="keyblay-debug-outer-wrapper-div"
      >

        <div className="w-full md:mr-8 md:px-4 z-10">

          <div className="border border-gray-300 bg-gray-100 rounded-md p-2 m-2">
            <h1 className="text-xl">keyblay</h1>
            <label htmlFor="keyblay-app-debug-selector" className="p-2 m-2">Debug level</label>
            <select
              onChange={event => setAppDebug({ debugLevel: parseInt(event.target.value) })}
              name="Debug levels"
              id="keyblay-app-debug-selector"
              className="p-2 m-2"
            >
              <option value="0">Off</option>
              <option value="1">Extra logging</option>
              <option value="2">Yet more logging, visuals</option>
            </select>
          </div>

          <Keyboard pressedKey={pressedKey} setPressedKey={setPressedKey} />

          <div className="bottom-auto top-0 left-0 right-0 border border-gray-300 bg-gray-100 rounded-md p-4 mb-4 mx-auto">
            <InfoPanel
              keyData={pressedKey}
              keyButtonOnClick={() => {
                router.push("/");
                setPressedKey({});
              }}
            />
          </div>
        </div>
        {/* We place the canvas last and therefore we do not need to specify a z-index -
         * it is naturally on top of the other content.
         */}
        <Diagram connections={connections} />
      </div>
    </>
  );
};
