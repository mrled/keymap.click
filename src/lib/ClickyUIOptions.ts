/* The options that can be passed in the query string.
 */
export class ClickyUIOptions {
  prefix: string;
  board: string;
  map: string;
  layer: string;
  id: string;

  constructor({
    prefix,
    board,
    map,
    layer,
    id,
  }: {
    prefix: string;
    board?: string;
    map?: string;
    layer?: string;
    id?: string;
  }) {
    this.prefix = prefix;
    this.board = board || "";
    this.map = map || "";
    this.layer = layer || "";
    this.id = id || "";
  }

  /* Parse a query string and return a QueryStringParams object.
   *
   * Can be passed the current window query string with window.location.search.
   *
   * Returns a QueryStringParams object and the input queryString with any parsed parameters removed.
   */
  static parseQueryString(
    prefix: string,
    queryString: string
  ): [ClickyUIOptions, URLSearchParams] {
    const params = new URLSearchParams(queryString);
    const newParams = new URLSearchParams();
    const result = new ClickyUIOptions({ prefix });
    params.forEach((value, key) => {
      switch (key) {
        case `${prefix}-board`:
          result.board = value;
          break;
        case `${prefix}-map`:
          result.map = value;
          break;
        case `${prefix}-layer`:
          result.layer = value;
          break;
        case `${prefix}-id`:
          result.id = value;
          break;
        default:
          newParams.set(key, value);
          break;
      }
    });
    return [result, newParams];
  }

  /* True if any of the parameters are set.
   */
  get any(): boolean {
    return !!this.board || !!this.map || !!this.layer || !!this.id;
  }

  /* Show a nice string
   */
  toString(): string {
    return `ClickyUIOptions: prefix: ${this.prefix}, board: ${this.board}, map: ${this.map}, layer: ${this.layer}, id: ${this.id}`;
  }
}
