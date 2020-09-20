import { useState } from "react";

import { objectTableCompare } from "~/lib/consoleLogHelper";
import { domrect2obj, isDOMRect } from "~/lib/geometry";

const changeMessageStyle = "color: magenta";

/* Return a loggable object from an arbitrary one
 *
 * Some objects are not easily loggable, e.g. DOMRects.
 */
const makeLoggable = (obj) => {
  if (obj === false || obj === null || obj === undefined) {
    // For falsey values that Object.getPrototypeOf doesn't work for, return an empty object
    return {};
  } else if (isDOMRect(obj)) {
    return domrect2obj(obj);
  } else {
    return obj;
  }
};

/* Emit a log message for a state change that was not necessary
 * because the state is idempotent and the old and new values are the same.
 */
const logUnnecessaryStateChange = (stateName, state) => {
  console.log(
    `%clogUnnucessaryStateChange for state ${stateName}: State change attempted, but value has not changed`,
    changeMessageStyle,
    state
  );
};

/* Emit a log message for a state change.
 *
 * If possible, show a table with a before and after value for an object.
 * Fall back to a JSON.stringify()'d before and after value.
 */
const logStateChange = (stateName, oldState, newState) => {
  const loggableOldState = makeLoggable(oldState);
  const loggableNewState = makeLoggable(newState);
  if (
    typeof loggableOldState === "object" &&
    typeof loggableNewState === "object"
  ) {
    const table = objectTableCompare(
      [loggableOldState, loggableNewState],
      ["oldValue", "newValue"]
    );
    console.log(
      `%clogStateChange for state ${stateName} table:`,
      changeMessageStyle
    );
    console.table(table);
  } else {
    console.info(
      [
        `%clogStateChange for state ${stateName}:`,
        `old: ${JSON.stringify(oldState)}`,
        `new: ${JSON.stringify(newState)}`,
      ].join("\n"),
      changeMessageStyle
    );
  }
};

/* A hook for a logged state
 *
 * The state is logged - before and after values of a change are recorded in the console.
 */
export const useLoggedState = (defaultValue, stateName) => {
  const [thisState, setThisState] = useState(defaultValue);
  const setLoggedStateWrapper = (newValue) => {
    logStateChange(stateName, thisState, newValue);
    setThisState(newValue);
  };
  return [thisState, setLoggedStateWrapper];
};

/* A hook for an idempotent logged state
 *
 * The state is logged - before and after values of a change are recorded in the console.
 *
 * The state is idempotent - if the new value is the same as the existing value, it does not update.
 * This has some benefits in React, where a state change might trigger some other behavior.
 * Require a comparator argument that returns true if two values are equal,
 * because generic object comparison is apparently hard for the JS runtime lol
 * and I'm certainly not going to do it for you for fucking free.
 */
export const useIdempotentLoggedState = (
  defaultValue,
  stateName,
  comparator = (obj1, obj2) => obj1 === obj2
) => {
  const [thisState, setThisState] = useState(defaultValue);
  const setIdempotentLoggedStateWrapper = (newValue) => {
    if (comparator(thisState, newValue)) {
      logUnnecessaryStateChange(stateName, thisState);
    } else {
      logStateChange(stateName, thisState, newValue);
      setThisState(newValue);
    }
  };
  return [thisState, setIdempotentLoggedStateWrapper];
};
