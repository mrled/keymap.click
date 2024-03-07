import React from "react";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";

const CodeMirror = ({ onChange, defaultText }) => {
  const editorDivRef = useRef();

  // Make a ref to the default text so that we can use it in the useEffect
  // without needing to add it to the dependency array.
  // This is ok because the doc: prop we pass to EditorState.create is stable.
  const defaultTextRef = useRef(defaultText);

  useEffect(() => {
    if (!editorDivRef.current) return;

    const startState = EditorState.create({
      doc: defaultTextRef.current,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorDivRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [onChange]);

  return <div ref={editorDivRef}></div>;
};

export default CodeMirror;
