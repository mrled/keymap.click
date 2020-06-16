import classnames from "classnames";

/* This is a small element used as an anchor point to connect a diagram line to this key.
 *
 * We use this because it is transformed with the outer element,
 * for instance the thumb clusters are moved and rotated,
 * and this div is to relatively the same place within its parent <Key> during that transformation.
 *
 * The parent <Key> element is large enough that when it rotates, its BoundingClientRect is enlarged,
 * so the calculation we were doing before of a few px from the top left was actually outside of
 * the rotated <Key> element itself.
 *
 * Technically, this little <div> will have the same problem - its BoundingClientRect is enlarged.
 * However, it is so small that this doesn't matter.
 * The diagram line still looks good inside the <Key>.
 */
const KeyHandler = ({ keyId }) => {
  const classes = "h-0 w-0 top-0 left-0 pointer-events-none";
  return keyId ? (
    <div id={keyId} className={classes} />
  ) : (
    <div className={classes} />
  );
};

/* A keyboard key
 * Properties:
 *   keyData:     An object e.g. from lib/keys.js
 *   onClick:     An onClick function
 *   standalone:  Return with classes for standalone rendering,
 *                rather than the default which returns with classes for rendering in a grid
 */
export const Key = ({
  keyData,
  onClick = null,
  standalone = false,
  id = null,
  active = false,
  targetKeyActive = false,
}) => {
  const {
    legend,
    size = [2, 2],
    startPos = ["auto", "auto"],
    fontSize = "text-xs",
    extraClasses = "",
  } = keyData;
  const [col, row] = size;
  const [colStart, rowStart] = startPos;

  const gridClasses = `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart}`;
  const standaloneClasses = `standalone-key standalone-key-w-${col} standalone-key-h-${row}`;
  const classes = classnames(
    standalone ? standaloneClasses : gridClasses,
    `hover:bg-gray-400 cursor-pointer p-1 flex justify-center items-center rounded-sm ${fontSize} font-mono`,
    "pointer-events-auto",
    {
      "bg-gray-400 border border-blue-500": active /* TODO: should be true when this key is selected */,
      "bg-gray-200 border border-gray-500": !active /* TODO: should be true when this key is not selected */,
      "bg-green-200 border border-green-500": targetKeyActive /* TODO: should be true when this key is not selected */,
    },
    extraClasses
  );

  return (
    <button onClick={onClick} className={classes}>
      <KeyHandler keyId={id} />
      {legend}
    </button>
  );
};

/* Return a grid of <Key> components
 * cols: The number of columsn in the grid
 * rows: Number of rows in the grid
 * keys: List of key data objects (e.g. lib/keys.js)
 * onClickEach: Optional function to call onClick for each <Key> component
 *   It will be called with the key data object as the first argument
 * appendClasses: Optional string containing classes to append to the parent grid <div>
 */
export const KeyGrid = ({
  cols,
  rows,
  keys,
  pressedKey,
  selectedKeys = [],
  onClickEach = () => {},
  gridAppendClasses = "",
  targetKeyIds = [],
}) => {
  console.log("pressedKey", pressedKey);
  return (
    <>
      <div
        className={classnames(
          `grid grid-cols-${cols}-keyb grid-rows-${rows}-keyb pointer-events-none`,
          gridAppendClasses
        )}
      >
        {keys.map((keyData) => {
          return (
            <Key
              id={keyData.id}
              targetKeyActive={
                targetKeyIds.findIndex((id) => id === keyData.id) > -1
              }
              active={
                keyData.id === pressedKey.reactKey ||
                selectedKeys.indexOf(keyData.id) > -1
              }
              key={keyData.reactKey}
              keyData={keyData}
              onClick={() => onClickEach(keyData)}
            />
          );
        })}
      </div>
    </>
  );
};
