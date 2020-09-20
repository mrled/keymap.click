/* Functions to log more nicely to the console
 */

/* Return a comparison object
 *
 * A comparison object is an object with keys from the union of both obj1 and obj2,
 * where the value is also an object with obj1: and obj2: keys.
 * This can be passed to console.table() to get a nice table in the console
 * in Chrome and Firefox.
 *
 * DEPRECATED - use objectTableCompare instead.
 */
// export const objectTableCompareDEPRECATED = (
//   obj1,
//   obj2,
//   obj1Title = "obj1",
//   obj2Title = "obj2"
// ) => {
//   // obj1 = obj1 ? obj1 : {};
//   // obj2 = obj2 ? obj2 : {};
//   const allKeys = Object.keys(obj1).concat(Object.keys(obj2));
//   const tableKeys = new Set(allKeys);
//   let table = {};
//   tableKeys.forEach((key) => {
//     table[key] = {
//       [obj1Title]: obj1[key],
//       [obj2Title]: obj2[key],
//     };
//   });
//   return table;
// };

/* Convert a list of objects to a single object representing a table.
 *
 * The table will contain a column for each key name in a list of the union of all key names across all objects,
 * and a column for the value at each key for each object.
 *
 * The resulting object can be passed to console.table().
 *
 * For instance:
 *
 * obj1 = {a: 1, b: 2, c: 3}
 * obj2 = {a: 11, b: 22, d: 44}
 * obj3 = {a: "one", c: "three", e: "five"}
 * console.table(objectTableCompare([obj1, obj2, obj3])) => {
 *    (index)   obj1        obj2        obj3
 *    a         1           11          "one"
 *    b         2           22          undefined
 *    c         3           undefined   "three"
 *    d         undefined   44          undefined
 *    e         undefined   undefined   "five"
 * }
 *
 * There is an optional second argument to pass names of the columns.
 */
export const objectTableCompare = (objList, names = []) => {
  let allKeys = [];
  objList.forEach((obj) => allKeys.push(...Object.keys(obj)));
  const tableKeys = new Set(allKeys);
  let table = {};
  tableKeys.forEach((key) => {
    let row = {};
    objList.forEach((obj, idx) => {
      const columnName = names[idx] || `obj${idx}`;
      row[columnName] = obj[key];
    });
    table[key] = row;
  });
  return table;
};
