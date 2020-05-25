import classnames from "classnames";

/* A keyboard key
 * Properties:
 *   keyData:     An object e.g. from lib/keys.js
 *   onClick:     An onClick function
 *   standalone:  Return with classes for standalone rendering,
 *                rather than the default which returns with classes for rendering in a grid
 */
export const Key = ({ keyData, onClick=null, standalone=false }) => {
  const {
    idx,
    legend,
    size=[2, 2],
    startPos=['auto', 'auto'],
    fontSize="text-xl",
    extraClasses='',
  } = keyData
  const [col, row] = size
  const [colStart, rowStart] = startPos

  const gridClasses = `col-span-${col} row-span-${row} col-start-${colStart} row-start-${rowStart}`
  const standaloneClasses = `standalone-key standalone-key-w-${col} standalone-key-h-${row}`
  const classes = classnames(
    standalone ? standaloneClasses : gridClasses,
    `hover:bg-gray-400 cursor-pointer p-1 flex justify-center items-center rounded-sm ${fontSize} font-mono`,
    {
      "bg-gray-400 border border-blue-500 shadow-outline": false, /* TODO: should be true when this key is selected */
      "bg-gray-200 border border-gray-500 focus:outline-none": true /* TODO: should be true when this key is not selected */
    },
    extraClasses
  )

  return (
    <button
      key={idx}
      onClick={onClick}
      className={classes}
    >{legend}</button>
  )
}