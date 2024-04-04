/* State interfaces
 */

/* A state observer interface
 *
 * The state observer is responsible for updating its view when the state changes.
 */
export interface IStateObserver<T> {
  update(key: keyof T, oldValue: T[keyof T] | null, newValue: T[keyof T]): void;
}
