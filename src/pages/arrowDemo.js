import React, { useCallback, useState } from "react";

import { SiteChrome } from "~/components/siteChrome";
import { IntraAppLink } from "~/components/prose";
import { invisibleStates, metadata } from "~/lib/invisibleStates";

import { useWhyDidYouUpdate } from "~/hooks/useWhyDidYouUpdate";
// import { useKeyboardShortcut } from "~/hooks/useKeyboardShortcut";

import CodeMirror from "@uiw/react-codemirror";
// import { useKeyboardShortcut } from "use-keyboard-shortcut";

function removeArrayItem(array, item) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

function demoDefaultText() {
  let result = [
    `This text box is here to edit and play around with.\nIt contains ${metadata}.`,
    "",
  ];
  for (const state in invisibleStates) {
    result.push(`${state}: ${invisibleStates[state]}`);
  }
  return result.join("\n");
}

export default function ArrowDemo() {
  const [keys, setKeys] = useState([]);
  const [value, setValue] = useState(demoDefaultText());
  const onChange = useCallback((editor, data, newValue) => {});
  useWhyDidYouUpdate("ArrowDemo", {});
  // useKeyboardShortcut(["Shift", "H"], () => {
  //   console.log("Shift+H");
  //   setKeys("Shift+H");
  // });
  // useKeyboardShortcut(["Shift", "I"], () => {
  //   console.log("Shift+I");
  //   setKeys(["Shift", "I"]);
  // });
  // useKeyboardShortcut(["Shift", "J"], () => {
  //   console.log("Shift+J");
  //   setKeys(["Shift", "J"]);
  // });
  // useKeyboardShortcut(["Shift", "K"], () => {
  //   console.log("Shift+K");
  //   setKeys(["Shift", "K"]);
  // });
  // useKeyboardShortcut(["Shift", "L"], () => {
  //   console.log("Shift+L");
  //   setKeys(["Shift", "L"]);
  // });

  function handleKeyDownEvent(event) {
    setKeys([...keys, event.key]);
    if (event.key == "Dead") {
      console.log(event);
    }
    event.preventDefault();
    event.stopPropagation();
  }
  function handleKeyUpEvent(event) {
    console.log(event.key);
    setKeys(removeArrayItem(keys, event.key));
    event.preventDefault();
    event.stopPropagation();
  }

  const pressedText = keys ? keys.join(", ") : "Nothing";

  return (
    <SiteChrome>
      <div className="w-full h-full text-sm md:text-base flex max-w-screen-lg mx-auto">
        <div className="w-full ">
          <div className="pt-2 mt-2">
            <div className="m-4 p-4">
              <h1 className="text-2xl pb-4">Arrow layer demo</h1>
              <p className="p-1">
                This demo shows how my{" "}
                <IntraAppLink href="/?keyId=l-f-8-9">arrow layer</IntraAppLink>.
              </p>
              <p>{pressedText} has been pressed.</p>
            </div>
            <CodeMirror value={value} height="400px" onChange={onChange} />
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
