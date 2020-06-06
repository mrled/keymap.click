import classnames from "classnames";

/* A keyboard key
 * Properties:
 *   keyData:     An object e.g. from lib/keys.js
 *   onClick:     An onClick function
 *   standalone:  Return with classes for standalone rendering,
 *                rather than the default which returns with classes for rendering in a grid
 */
export const Key = ({ keyData, onClick=null, standalone=false, id=null }) => {
  const {
    legend,
    size=[2, 2],
    startPos=['auto', 'auto'],
    fontSize="text-xs",
    extraClasses='',
  } = keyData
  const [col, row] = size
  const [colStart, rowStart] = startPos

  const gridClasses = `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart}`
  const standaloneClasses = `standalone-key standalone-key-w-${col} standalone-key-h-${row}`
  const classes = classnames(
    standalone ? standaloneClasses : gridClasses,
    `hover:bg-gray-400 cursor-pointer p-1 flex justify-center items-center rounded-sm ${fontSize} font-mono`,
    "pointer-events-auto",
    {
      "bg-gray-400 border border-blue-500 shadow-outline": false, /* TODO: should be true when this key is selected */
      "bg-gray-200 border border-gray-500 focus:outline-none": true /* TODO: should be true when this key is not selected */
    },
    extraClasses
  )

  return (
    <button
      id={id}
      onClick={onClick}
      className={classes}
    >{legend}</button>
  )
}

/* Return a grid of <Key> components
 * cols: The number of columsn in the grid
 * rows: Number of rows in the grid
 * keys: List of key data objects (e.g. lib/keys.js)
 * onClickEach: Optional function to call onClick for each <Key> component
 *   It will be called with the key data object as the first argument
 * appendClasses: Optional string containing classes to append to the parent grid <div>
 */
export const KeyGrid = ({ cols, rows, keys, onClickEach=()=>{}, gridAppendClasses=""} ) => {
  return (
    <>
      <div
        className={classnames(
          `grid grid-cols-${cols}-keyb grid-rows-${rows}-keyb pointer-events-none`,
          gridAppendClasses,
        )}
      >
        {keys.map((keyData) => {
          return (
            <Key id={keyData.id} key={keyData.reactKey} keyData={keyData} onClick={() => {onClickEach(keyData)}} />
          );
        })}
      </div>
    </>
  )
}

