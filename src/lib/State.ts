/* State provider and observer interfaces
 */

/* A state provider interface
 *
 * The state provider is responsible for managing state observers and notifying them of changes.
 */
export interface IStateProvider<T> {
  attach(observer: IStateObserver<T>): void;
  detach(observer: IStateObserver<T>): void;
  notify(changedKey: keyof T, oldValue: T[keyof T], newValue: T[keyof T]): void;
}

/* A state observer interface
 *
 * The state observer is responsible for updating its view when the state changes.
 */
export interface IStateObserver<T> {
  update(key: keyof T, oldValue: T[keyof T], newValue: T[keyof T]): void;
}
