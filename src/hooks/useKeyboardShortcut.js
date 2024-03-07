import { useEffect, useCallback, useReducer } from "react";

function disabledEventPropagation(e) {
  if (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
}

const blacklistedTargets = ["INPUT", "TEXTAREA"];

const keysReducer = (state, action) => {
  switch (action.type) {
    case "set-key-down":
      return { ...state, [action.key]: true };
    case "set-key-up":
      return { ...state, [action.key]: false };
    case "reset-keys":
      return { ...action.data };
    default:
      return state;
  }
};

const useKeyboardShortcut = (shortcutKeys, callback, options) => {
  if (!Array.isArray(shortcutKeys))
    throw new Error(
      "The first parameter to `useKeyboardShortcut` must be an ordered array of `KeyboardEvent.key` strings."
    );

  if (!shortcutKeys.length)
    throw new Error(
      "The first parameter to `useKeyboardShortcut` must contain atleast one `KeyboardEvent.key` string."
    );

  if (!callback || typeof callback !== "function")
    throw new Error(
      "The second parameter to `useKeyboardShortcut` must be a function that will be envoked when the keys are pressed."
    );

  console.log(`Using keyboard shortcut with keys: ${shortcutKeys}`);

  const { overrideSystem } = options || {};
  const initalKeyMapping = shortcutKeys.reduce((currentKeys, key) => {
    currentKeys[key.toLowerCase()] = false;
    return currentKeys;
  }, {});

  const [keys, setKeys] = useReducer(keysReducer, initalKeyMapping);

  const keydownListener = useCallback(
    (assignedKey) => (keydownEvent) => {
      const loweredKey = assignedKey.toLowerCase();

      if (keydownEvent.repeat) return;
      if (blacklistedTargets.includes(keydownEvent.target.tagName)) return;
      if (loweredKey !== keydownEvent.key.toLowerCase()) return;
      if (keys[loweredKey] === undefined) return;

      if (overrideSystem) {
        keydownEvent.preventDefault();
        disabledEventPropagation(keydownEvent);
      }

      setKeys({ type: "set-key-down", key: loweredKey });
      return false;
    },
    [keys, overrideSystem]
  );

  const keyupListener = useCallback(
    (assignedKey) => (keyupEvent) => {
      const raisedKey = assignedKey.toLowerCase();

      if (blacklistedTargets.includes(keyupEvent.target.tagName)) return;
      if (keyupEvent.key.toLowerCase() !== raisedKey) return;
      if (keys[raisedKey] === undefined) return;

      if (overrideSystem) {
        keyupEvent.preventDefault();
        disabledEventPropagation(keyupEvent);
      }

      setKeys({ type: "set-key-up", key: raisedKey });
      return false;
    },
    [keys, overrideSystem]
  );

  useEffect(() => {
    if (!Object.values(keys).filter((value) => !value).length) {
      callback(keys);
      setKeys({ type: "reset-keys", data: initalKeyMapping });
    } else {
      setKeys({ type: null });
    }
  }, [callback, initalKeyMapping, keys]);

  useEffect(() => {
    shortcutKeys.forEach((k) =>
      window.addEventListener("keydown", keydownListener(k))
    );
    return () =>
      shortcutKeys.forEach((k) =>
        window.removeEventListener("keydown", keydownListener(k))
      );
  }, [keydownListener, shortcutKeys]);

  useEffect(() => {
    shortcutKeys.forEach((k) =>
      window.addEventListener("keyup", keyupListener(k))
    );
    return () =>
      shortcutKeys.forEach((k) =>
        window.removeEventListener("keyup", keyupListener(k))
      );
  }, [keyupListener, shortcutKeys]);
};

export default useKeyboardShortcut;
